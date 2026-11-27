"""Persistent accounts and the shared classroom atlas."""
import hashlib
import hmac
import json
import os
import re
import secrets
import time
import unicodedata
from pathlib import Path


def schema(db):
    for definition in (
        "accounts(id TEXT PRIMARY KEY, login TEXT UNIQUE NOT NULL, salt TEXT, digest TEXT, profile TEXT, revision INTEGER)",
        "sessions(digest TEXT PRIMARY KEY, owner TEXT, expires BIGINT)",
        "catalog(id INTEGER PRIMARY KEY, body TEXT, revision INTEGER)",
        "revoked_arena(id TEXT PRIMARY KEY)",
        "attempts(login TEXT PRIMARY KEY, count INTEGER, since BIGINT)",
    ):
        db.execute("CREATE TABLE IF NOT EXISTS " + definition)
    if not db.execute("SELECT id FROM catalog WHERE id=1").fetchone():
        seed = Path(__file__).with_name("catalog.json").read_text()
        db.execute("INSERT INTO catalog VALUES (1,?,0)", (seed,))


def check(condition, message):
    if not condition:
        raise ValueError(message)


def field(value, limit, required=True):
    check(isinstance(value, str) and len(value) <= limit and (value.strip() or not required),
          "Isian kosong atau terlalu panjang.")
    return value.strip()


def teacher(owner):
    return owner in os.environ.get("TEACHER_ACCOUNT_IDS", "").split(",")


def token_hash(token):
    return hashlib.sha256(token.encode()).hexdigest()


def catalog(db):
    raw, rev = db.execute("SELECT body, revision FROM catalog WHERE id=1").fetchone()
    entries = json.loads(raw)
    for index, world in enumerate(entries):
        world.setdefault("key", index)
        world.setdefault("visual", index % 6)
    return entries, rev


def active_worlds(entries):
    return [w for w in entries if not w.get("deleted")]


def valid_profile(p, worlds):
    check(isinstance(p, dict), "Profil tidak valid.")
    quests = {q["id"]: q for w in worlds for q in w["quests"]}
    historical = {i for w in worlds for i in w.get("retired", [])}
    done = p.get("done", [])
    steps = p.get("steps", {})
    check(isinstance(done, list) and all(type(i) is int and (i in quests or i in historical) for i in done)
          and isinstance(steps, dict), "Progres quest tidak valid.")
    done = list(dict.fromkeys(done))
    skin = p.get("skin", 0)
    gates = [0,1,3,6,2,4,5,8,10,12,15,18]+[2+i*16//19 for i in range(20)]
    character = p.get("character",0)
    def unlocked(key, thresholds):
        value = p.get(key, 0)
        return value if type(value) is int and 0 <= value < len(thresholds) and thresholds[value] <= len(done) else 0
    visible = active_worlds(worlds)
    active_ids = {q["id"] for w in visible for q in w["quests"]}
    key = p.get("worldKey", p.get("world", 0))
    world = next((i for i,w in enumerate(visible) if w["key"] == key), 0)
    return dict(name=field(p.get("name"), 24), done=done,
                steps={str(i): n for i in active_ids if type(n := steps.get(str(i))) is int
                       and 0 < n < len(quests[i]["questions"])},
                character=character if type(character) is int and 0<=character<12 else 0,
                gear=unlocked("gear",[0,4,8,12,2,7,5,3,4,9,10,15,7,3,6,4,5,11,6,8,9,2,3,4,5]),
                accessory=unlocked("accessory",[0,2,4,6,8,1,3,5,7,9,11,14,18]),
                skin=skin if type(skin) is int and 0 <= skin < len(gates) and gates[skin] <= len(done) else 0,
                world=world, worldKey=visible[world]["key"] if visible else None)


def delete_player(db, target, login):
    check(isinstance(target,str) and not teacher(target), "Hanya akun pemain yang dapat dihapus.")
    row=db.execute("SELECT login,profile FROM accounts WHERE id=?", (target,)).fetchone()
    check(row and row[0]==login, "Nama pengguna konfirmasi tidak sesuai atau akun sudah dihapus.")
    old_token=json.loads(row[1])["arenaToken"]
    key=token_hash(old_token)
    db.execute("DELETE FROM sessions WHERE owner=?", (target,))
    db.execute("DELETE FROM attempts WHERE login=?", (login,))
    db.execute("DELETE FROM accounts WHERE id=?", (target,))
    db.execute("INSERT INTO revoked_arena VALUES (?) ON CONFLICT(id) DO NOTHING", (key,))
    # Some older imports shared an arena identity. Keep the surviving accounts' scores.
    replacement=secrets.token_hex(32)
    shared=False
    for ident,raw in db.execute("SELECT id,profile FROM accounts").fetchall():
        profile=json.loads(raw)
        if profile["arenaToken"]==old_token:
            shared=True
            profile["arenaToken"]=replacement
            db.execute("UPDATE accounts SET profile=?,revision=revision+1 WHERE id=?",(json.dumps(profile),ident))
    if shared:
        db.execute("UPDATE players SET id=? WHERE id=?", (token_hash(replacement),key))
    else:
        db.execute("DELETE FROM players WHERE id=?", (key,))
    for code,raw in db.execute("SELECT code,body FROM rooms").fetchall():
        room=json.loads(raw)
        if key not in room["members"]:
            continue
        departed=room["members"].pop(key)
        if shared:
            room["members"][token_hash(replacement)]=departed
        else:
            room["awardedPlaces"]=max(room.get("awardedPlaces",0),departed["place"])
        if room["members"]:
            db.execute("UPDATE rooms SET body=? WHERE code=?", (json.dumps(room),code))
        else:
            db.execute("DELETE FROM rooms WHERE code=?", (code,))
    return {"ok":True}


def account_action(db, data):
    action = data.get("action")
    now = int(time.time())
    if action in ("register", "login"):
        login = unicodedata.normalize("NFKC", field(data.get("login"), 48)).casefold()
        password = data.get("password")
        check(isinstance(password, str) and 1 <= len(password) <= 128, "Kata sandi tidak valid.")
        row = db.execute("SELECT id,salt,digest FROM accounts WHERE login=?", (login,)).fetchone()
        if action == "register":
            check(not row, "Nama pengguna sudah dipakai.")
            check(len(password) >= 8, "Gunakan minimal 8 karakter untuk kata sandi.")
            salt = secrets.token_hex(16)
            owner = secrets.token_hex(16)
            imported = data.get("profile", {})
            p = valid_profile(imported, catalog(db)[0])
            arena = imported.get("arenaToken")
            p["arenaToken"] = arena if isinstance(arena,str) and re.fullmatch("[a-f0-9]{64}", arena) else secrets.token_hex(32)
            if db.execute("SELECT id FROM revoked_arena WHERE id=?", (token_hash(p["arenaToken"]),)).fetchone():
                p["arenaToken"]=secrets.token_hex(32)
            digest = hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(salt), 600000).hex()
            db.execute("INSERT INTO accounts VALUES (?,?,?,?,?,0)", (owner,login,salt,digest,json.dumps(p)))
        else:
            check(row, "Nama pengguna atau kata sandi salah.")
            attempt = db.execute("SELECT count,since FROM attempts WHERE login=?", (login,)).fetchone()
            count, since = attempt if attempt and now-attempt[1]<300 else (0, now)
            check(count < 8, "Terlalu banyak percobaan. Coba lagi dalam 5 menit.")
            owner,salt,expected = row
            digest = hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(salt), 600000).hex()
            if not hmac.compare_digest(digest,expected):
                db.execute("INSERT INTO attempts VALUES (?,?,?) ON CONFLICT(login) DO UPDATE SET count=excluded.count,since=excluded.since",(login,count+1,since))
                return {"error":"Nama pengguna atau kata sandi salah."}
            db.execute("DELETE FROM attempts WHERE login=?", (login,))
        session = secrets.token_urlsafe(32)
        db.execute("DELETE FROM sessions WHERE expires<=?",(now,))
        db.execute("INSERT INTO sessions VALUES (?,?,?)",(token_hash(session),owner,now+30*86400))
    else:
        session = field(data.get("session",""), 128, False)
        row = db.execute("SELECT owner FROM sessions WHERE digest=? AND expires>?", (token_hash(session),now)).fetchone()
        if not row:
            return {"error":"Sesi berakhir. Silakan masuk kembali.", "expired":True}
        owner = row[0]
    if action == "logout":
        db.execute("DELETE FROM sessions WHERE digest=?", (token_hash(session),))
        return {"ok":True}
    if action in ("listPlayers","deletePlayer"):
        check(teacher(owner), "Hanya guru yang dapat mengelola akun.")
        if action=="deletePlayer":
            return delete_player(db,data.get("target"),data.get("confirmation"))
        return {"players":[dict(id=ident,login=login,name=json.loads(raw)["name"])
                           for ident,login,raw in db.execute("SELECT id,login,profile FROM accounts ORDER BY login")
                           if not teacher(ident)]}
    if action == "leaderboard":
        from server import rank
        offset=data.get("offset",0)
        check(type(offset) is int and offset>=0,"Halaman tidak valid.")
        scores={key:rp for key,rp in db.execute("SELECT id,rp FROM players")}
        ranking=[]
        for account_id, raw in db.execute("SELECT id,profile FROM accounts"):
            profile=json.loads(raw)
            rp=scores.get(token_hash(profile["arenaToken"]),0)
            look = {key: profile.get(key, 0) for key in ("character", "skin", "gear", "accessory")}
            ranking.append((rp,profile["name"],account_id,look))
        ranking.sort(key=lambda row:(-row[0],row[1].casefold(),row[2]))
        page=[]; mine=None; previous=None
        for i,(rp,name,ident,look) in enumerate(ranking):
            if rp!=previous:
                place=i+1
                previous=rp
            if ident==owner or offset<=i<offset+25:
                row=dict(place=place,name=name,rp=rp,rank=rank(rp),me=ident==owner,look=look)
                if ident==owner: mine=row
                if offset<=i<offset+25: page.append(row)
        return dict(rows=page,mine=mine,total=len(ranking))
    worlds, version = catalog(db)
    visible = active_worlds(worlds)
    if action == "publish":
        check(teacher(owner), "Hanya guru yang dapat menerbitkan perubahan.")
        check(data.get("version")==version, "Atlas telah berubah. Muat ulang sebelum mengedit kembali.")
        wid = data.get("world")
        check(type(wid) is int and 0<=wid<=len(visible), "Wilayah tidak tersedia.")
        if data.get("kind") == "deleteMap":
            check(wid < len(visible), "Map tidak ditemukan.")
            world = visible[wid]
            # Retain only IDs to preserve XP and prevent quest ID reuse.
            worlds[world["key"]] = {"key":world["key"], "deleted":True,
                                    "retired":world.get("retired",[]),
                                    "quests":[{"id":q["id"]} for q in world["quests"]]}
        elif data.get("kind") == "deleteQuest":
            check(wid<len(visible), "Map tidak ditemukan.")
            world=visible[wid]
            quest_id=data.get("quest")
            quest=next((q for q in world["quests"] if type(quest_id) is int and q["id"]==quest_id), None)
            check(quest, "Quest tidak ditemukan.")
            world["quests"].remove(quest)
            world.setdefault("retired", []).append(quest_id)
        elif data.get("kind") == "map":
            if wid == len(visible):
                world = {"key":len(worlds), "visual":len(worlds)%6, "quests":[]}
                worlds.append(world)
            else:
                world = visible[wid]
            visual = data.get("visual", world["visual"])
            check(type(visual) is int and 0 <= visual < 6, "Tema visual tidak tersedia.")
            world.update(visual=visual,title=field(data.get("title"),100), theme=field(data.get("theme"),300))
        else:
            check(wid<len(visible), "Simpan map terlebih dahulu.")
            quests = visible[wid]["quests"]
            qid = data.get("quest")
            target = next((q for q in quests if q["id"]==qid),None)
            check(target or qid is None, "Quest tidak ditemukan.")
            lesson, rows = data.get("lesson"), data.get("questions")
            check(isinstance(lesson,list) and len(lesson)==5 and isinstance(rows,list) and 1<=len(rows)<=30, "Isi 1–30 soal.")
            lesson = [field(s,100 if j==0 else 1000,j==0) for j,s in enumerate(lesson)]
            questions = []
            for row in rows:
                check(isinstance(row,list) and len(row)==5, "Soal tidak lengkap.")
                question = [field(s,600,j<4) for j,s in enumerate(row)]
                check(len(set(question[1:4]))==3, "Ketiga pilihan jawaban harus berbeda.")
                questions.append(question)
            if target is None:
                target = {"id":1+max((i for w in worlds for i in [*w.get("retired", []), *(q["id"] for q in w["quests"])]), default=-1)}
                quests.append(target)
            target.update(lesson=lesson,questions=questions)
        version += 1
        db.execute("UPDATE catalog SET body=?,revision=? WHERE id=1",(json.dumps(worlds),version))
        return dict(worlds=active_worlds(worlds),version=version)
    raw, revision = db.execute("SELECT profile,revision FROM accounts WHERE id=?",(owner,)).fetchone()
    stored = json.loads(raw)
    if action == "save":
        check(data.get("revision")==revision, "Progres berubah di perangkat lain. Muat ulang halaman.")
        check(data.get("version")==version, "Guru telah memperbarui atlas. Muat ulang halaman.")
        updates = data.get("profile")
        check(isinstance(updates,dict), "Profil tidak valid.")
        selected = updates.get("world",0)
        if type(selected) is int and 0<=selected<len(visible):
            updates["worldKey"] = visible[selected]["key"]
        profile = valid_profile(updates,worlds)
        profile["arenaToken"] = stored["arenaToken"]
        db.execute("UPDATE accounts SET profile=?,revision=? WHERE id=?",(json.dumps(profile),revision+1,owner))
        return {"revision":revision+1}
    check(action in ("login","register","resume"), "Aksi akun tidak dikenal.")
    p = valid_profile(stored, worlds)
    arena = stored["arenaToken"]
    score = db.execute("SELECT xp,rp FROM players WHERE id=?", (token_hash(arena),)).fetchone() or (0,0)
    from server import rank
    p.update(id=owner,arenaToken=arena,arenaXP=score[0],arenaRP=score[1],arenaRank=rank(score[1]))
    return dict(session=session,profile=p,revision=revision,worlds=visible,version=version,teacher=teacher(owner))
