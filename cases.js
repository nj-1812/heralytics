// HERALYTICS case files. Add Cases 03-10 here in the same shape as Case 01.
// Answers are stored as btoa(reversed answer with spaces removed, lowercased).
// Generate one in the browser console: btoa("your answer".toLowerCase().replace(/\s+/g,"").split("").reverse().join(""))
/* ---------- CASE DATA ---------- */
export const PTS = 14, HINT_COST = 3, MAX_ATTEMPTS = 5;
export const CASES = [
 { id:1, title:"The Midnight Murder", place:"Kovalam Ridge Observatory", date:"14 Mar 1987", time:"23:45 – 00:05",
   crime:"Homicide",
   summary:"Dr. Meera Kalyan, senior astronomer at Kovalam Ridge Observatory, was found dead inside the telescope dome at 00:26. The dome door had been opened with a manual override. Five people held active badges on the site that night.",
   details:"Night guard Leela Thomas found the body during her rounds. The coroner places death between 23:45 and 00:05. The telescope's observation log stops mid-entry at 23:49. Nothing was taken from the dome, but Dr. Kalyan's draft report on the observatory's funding audit is missing from her desk.",
   timeline:[["23:02","Dr. Kalyan badges into Dome 1 for her night session."],["23:24","Funding director Vikram Sethi arrives through the main gate."],["23:40","Car park camera feed drops to static."],["23:49","Last entry in the telescope observation log."],["00:10","Car park camera feed returns."],["00:26","Guard Leela Thomas finds the body in Dome 1."]],
   suspects:[
    {name:"Vikram Sethi",role:"Funding director",badge:"BADGE-881",alibi:"Sat in my car in the car park on a long phone call from 23:30 until about 00:15.",motive:"Dr. Kalyan's audit report flagged missing grant money under his signature.",tone:"#7a5a3a",shape:2},
    {name:"Priya Nair",role:"Research fellow",badge:"BADGE-412",alibi:"I left through the east gate at 23:30 and went straight home.",motive:"Passed over for co-authorship on Dr. Kalyan's comet paper.",tone:"#4d3b2a",shape:1},
    {name:"Arjun Rao",role:"Night technician",badge:"BADGE-207",alibi:"I was in the lobby control room the whole night watching the instrument feeds.",motive:"Was warned by Dr. Kalyan about unauthorised server access.",tone:"#5c4630",shape:0},
    {name:"Leela Thomas",role:"Security guard",badge:"BADGE-118",alibi:"Patrolling the east wing. My badge stopped working after midnight so I had to override the door.",motive:"None known. Found the body.",tone:"#3e3226",shape:1},
    {name:"Dev Menon",role:"Graduate student",badge:"BADGE-305",alibi:"In the library annex writing my thesis. I stepped out once for tea.",motive:"Dr. Kalyan was about to fail his thesis chapter.",tone:"#6b5238",shape:0}
   ],
   evidence:[
    {k:"A",title:"Tampered door seal",art:"door",note:"Dome 1 keypad shows a manual override. The override log is stored in the access records."},
    {k:"B",title:"Shoe impression",art:"shoe",note:"Size 10 leather sole print in the dome dust. Formal shoe, not a work boot."},
    {k:"C",title:"Telescope log",art:"log",note:"Final entry cut off mid-sentence at 23:49."},
    {k:"D",title:"Car park camera",art:"static",note:"Feed lost 23:40 – 00:10. Nobody's car alibi can be checked on video."}
   ],
   datasets:[
    {file:"access_log.csv",cols:["timestamp","badge_id","holder","door","direction","override_used"],rows:`21:58:02,BADGE-412,Priya Nair,DOME-1,IN,FALSE
22:05:13,BADGE-305,Dev Menon,LIBRARY,IN,FALSE
22:10:40,BADGE-207,Arjun Rao,SERVER-RM,IN,TRUE
22:31:02,BADGE-207,Arjun Rao,SERVER-RM,OUT,FALSE
22:34:48,BADGE-207,Arjun Rao,LOBBY,IN,FALSE
22:48:19,BADGE-118,Leela Thomas,EAST-2,IN,FALSE
23:02:55,BADGE-901,Meera Kalyan,DOME-1,IN,FALSE
23:11:37,BADGE-412,Priya Nair,DOME-1,OUT,FALSE
23:24:06,BADGE-881,Vikram Sethi,MAIN-GATE,IN,FALSE
23:29:44,BADGE-412,Priya Nair,EAST-2,IN,FALSE
23:38:04,BADGE-118,Leela Thomas,EAST-2,OUT,FALSE
23:41:15,BADGE-305,Dev Menon,LIBRARY,OUT,FALSE
23:43:27,BADGE-305,Dev Menon,LIBRARY,IN,FALSE
23:47:51,BADGE-881,Vikram Sethi,DOME-1,IN,TRUE
23:52:09,BADGE-412,Priya Nair,EAST-GATE,OUT,FALSE
23:58:30,BADGE-881,Vikram Sethi,DOME-1,OUT,FALSE
00:01:12,BADGE-881,Vikram Sethi,MAIN-GATE,OUT,FALSE
00:20:47,BADGE-118,Leela Thomas,EAST-2,IN,TRUE
00:26:05,BADGE-118,Leela Thomas,DOME-1,IN,FALSE`},
    {file:"phone_records.csv",cols:["caller","number","call_start","call_end","duration_min","tower"],rows:`Vikram Sethi,98401 12233,23:31:10,23:44:02,13,OBS-RIDGE
Priya Nair,94440 55871,23:55:40,23:58:12,3,EAST-ROAD
Arjun Rao,90031 66420,22:15:05,22:19:30,4,OBS-RIDGE
Dev Menon,99620 18877,23:41:20,23:42:55,2,OBS-RIDGE
Leela Thomas,97100 40213,00:27:10,00:31:48,5,OBS-RIDGE
Vikram Sethi,98401 12233,00:03:44,00:06:01,2,COAST-HWY`}
   ],
   questions:[
    {t:"mc",q:"Who killed Dr. Meera Kalyan?",opts:["Vikram Sethi","Priya Nair","Arjun Rao","Leela Thomas","Dev Menon"],a:"aWh0ZXNtYXJraXY=",hint:"Whose badge opened Dome 1 inside the crime window?"},
    {t:"text",q:"Which badge ID opened Dome 1 with a manual override?",ph:"e.g. BADGE-000",a:"MTg4LWVnZGFi",hint:"Filter the override_used column to TRUE."},
    {t:"num",q:"How many override events appear in the access log in total?",ph:"number",a:"Mw==",hint:"Count every TRUE in override_used, not only those at Dome 1."},
    {t:"text",q:"At exactly what time did the killer enter Dome 1? (hh:mm:ss)",ph:"hh:mm:ss",a:"MTU6NzQ6MzI=",hint:"Use the timestamp on the override row at DOME-1."},
    {t:"mc",q:"Which other suspect lied about where they were, but was not in the dome?",opts:["Priya Nair","Arjun Rao","Leela Thomas","Dev Menon"],a:"cmlhbmF5aXJw",hint:"Compare each alibi time with the exit times in the log."}
   ]},
 { id:2, title:"The Marina Diamond Heist", place:"Marina Gem Exchange vault", date:"02 Apr 1987", time:"09:00 – 10:05",
   crime:"Theft",
   summary:"A consignment of uncut diamonds was weighed into the Marina Gem Exchange vault in twelve sealed crates. At the evening audit one crate came up short. The stones were weighed, not counted, so the scales are the only witness.",
   details:"Every crate has the same 2.100 kg tare. Net weight on the scale should match the declared net weight on the manifest. Three scales were in use and three handlers moved the crates.",
   timeline:[["09:02","First crate weighed on scale SC-1."],["09:44","Crate CR-0419 weighed on scale SC-2."],["10:01","Last crate weighed and moved to the vault."],["18:30","Evening audit flags a shortfall."]],
   suspects:[
    {name:"Sameer Khan",role:"Handler H-07",badge:"H-07",alibi:"I only carried crates. I never opened a single one.",motive:"Gambling debts, according to a coworker.",tone:"#5c4630",shape:0},
    {name:"Anita D'Souza",role:"Vault manager",badge:"VM-01",alibi:"I was in the office signing manifests until noon.",motive:"Holds the master manifest and could change declared weights.",tone:"#4d3b2a",shape:1},
    {name:"Rohan Pillai",role:"Handler H-05",badge:"H-05",alibi:"My crates always read a bit heavy. That scale is broken, not me.",motive:"Recently denied a raise.",tone:"#7a5a3a",shape:2},
    {name:"Kavya Iyer",role:"Insurance assessor",badge:"INS-3",alibi:"I arrived at 11:00, after the weighing was over.",motive:"Her firm pays out if the loss is accepted.",tone:"#3e3226",shape:1}
   ],
   evidence:[
    {k:"A",title:"Resealed crate",art:"crate",note:"Crate CR-0419 carries a wax seal in a slightly different red from the others."},
    {k:"B",title:"Calibration sticker",art:"sticker",note:"Scale SC-3's calibration sticker expired last month."},
    {k:"C",title:"Locker 7 glove",art:"glove",note:"A cotton glove with fine stone dust, found in the handlers' locker room."}
   ],
   datasets:[
    {file:"scale_log.csv",cols:["crate_id","scale","time","handler","gross_kg","tare_kg","net_kg","declared_net_kg"],rows:`CR-0411,SC-1,09:02,H-03,6.512,2.100,4.412,4.412
CR-0412,SC-2,09:07,H-07,5.880,2.100,3.780,3.780
CR-0413,SC-1,09:11,H-03,6.250,2.100,4.150,4.150
CR-0414,SC-3,09:15,H-05,7.004,2.100,4.904,4.902
CR-0415,SC-2,09:20,H-07,6.640,2.100,4.540,4.540
CR-0416,SC-3,09:26,H-05,5.932,2.100,3.832,3.830
CR-0417,SC-1,09:31,H-03,6.118,2.100,4.018,4.018
CR-0418,SC-2,09:36,H-05,6.075,2.100,3.975,3.975
CR-0419,SC-2,09:44,H-07,6.308,2.100,4.208,4.250
CR-0420,SC-3,09:49,H-03,6.402,2.100,4.302,4.300
CR-0421,SC-1,09:55,H-05,5.760,2.100,3.660,3.660
CR-0422,SC-2,10:01,H-07,6.990,2.100,4.890,4.890`}
   ],
   questions:[
    {t:"text",q:"Which crate is short of its declared weight?",ph:"e.g. CR-0000",a:"OTE0MC1yYw==",hint:"Compare net_kg with declared_net_kg row by row."},
    {t:"num",q:"How many grams are missing from that crate?",ph:"grams",a:"MjQ=",hint:"Declared minus measured net, then convert kg to grams."},
    {t:"text",q:"Which handler ID weighed that crate?",ph:"e.g. H-00",a:"NzAtaA==",hint:"Read the handler column on the short crate's row."},
    {t:"mc",q:"Who stole the diamonds?",opts:["Sameer Khan","Anita D'Souza","Rohan Pillai","Kavya Iyer"],a:"bmFoa3JlZW1hcw==",hint:"Match the handler ID to a suspect dossier."},
    {t:"text",q:"Which scale reads consistently heavy because of calibration drift?",ph:"e.g. SC-0",a:"My1jcw==",hint:"Look for a scale where every crate is a little over its declared weight."}
   ]},
 {id:3,title:"Wire Fraud at Coastal Co-op",crime:"Fraud"},
 {id:4,title:"The Stolen Exam Papers",crime:"Theft"},
 {id:5,title:"Cyber Exfiltration",crime:"Data breach"},
 {id:6,title:"The Flight Manifest",crime:"Smuggling"},
 {id:7,title:"The Print Room Leak",crime:"Leak"},
 {id:8,title:"Signal Lost",crime:"Sabotage"},
 {id:9,title:"The Insider",crime:"Conspiracy"},
 {id:10,title:"Unmasking ARCHITECT-ZERO",crime:"Mastermind"}
];

