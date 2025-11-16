PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE user (
	id INTEGER NOT NULL, 
	email VARCHAR NOT NULL, 
	hashed_password VARCHAR NOT NULL, image_type TEXT, auth_code TEXT, 
	PRIMARY KEY (id)
);
INSERT INTO user VALUES(1,'test1@a.b','$2b$12$SWvuBvsC4ZgDi26n9PjGYeHF5GY0LnitN5qliHbcbZi8Sr.BdLXOy','pretty','pretty');
INSERT INTO user VALUES(2,'test2@a.b','$2b$12$XngNVKTR0xgwUdbgdVYHOOETKzemT92y.En6hcCBHZ9kwEtHKGFeK','gardevoir','gardevoir');
INSERT INTO user VALUES(3,'test3@a.b','$2b$12$qQhgBwsy7e8nVDpq2CI0eufDFMi3vlTeexIMlImb3bBSlm6ugno.O','lucario','lucario');
INSERT INTO user VALUES(4,'admin@poke.dp','$2b$12$Xpcj6o6lB.rPv0W9q4ozWuG2aLBMWllIorDMqPvKCZtHktrvcWx6S','gardevoir','gardevoir');
INSERT INTO user VALUES(5,'test@poke.dp','$2b$12$KZFgfqoQpK5aVXX0F.Ek0uM6c6epFiihZ7bshm7bMSNShBYPLS6gq','lucario','lucario');
CREATE TABLE pokemon (
	name VARCHAR NOT NULL, 
	poke_id INTEGER NOT NULL, 
	sinnoh_poke_id INTEGER, 
	type_1 VARCHAR NOT NULL, 
	type_2 VARCHAR, 
	sprite_url VARCHAR NOT NULL, 
	id INTEGER NOT NULL, 
	PRIMARY KEY (id)
);
INSERT INTO pokemon VALUES('모부기',387,1,'풀',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/387.png',1);
INSERT INTO pokemon VALUES('수풀부기',388,2,'풀',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/388.png',2);
INSERT INTO pokemon VALUES('토대부기',389,3,'풀','땅','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/389.png',3);
INSERT INTO pokemon VALUES('불꽃숭이',390,4,'불꽃',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/390.png',4);
INSERT INTO pokemon VALUES('파이숭이',391,5,'불꽃','격투','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/391.png',5);
INSERT INTO pokemon VALUES('초염몽',392,6,'불꽃','격투','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/392.png',6);
INSERT INTO pokemon VALUES('팽도리',393,7,'물',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/393.png',7);
INSERT INTO pokemon VALUES('팽태자',394,8,'물',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/394.png',8);
INSERT INTO pokemon VALUES('엠페르트',395,9,'물','강철','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/395.png',9);
INSERT INTO pokemon VALUES('찌르꼬',396,10,'노말','비행','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/396.png',10);
INSERT INTO pokemon VALUES('찌르버드',397,11,'노말','비행','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/397.png',11);
INSERT INTO pokemon VALUES('찌르호크',398,12,'노말','비행','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/398.png',12);
INSERT INTO pokemon VALUES('비버니',399,13,'노말',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/399.png',13);
INSERT INTO pokemon VALUES('비버통',400,14,'노말','물','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/400.png',14);
INSERT INTO pokemon VALUES('귀뚤뚜기',401,15,'벌레',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/401.png',15);
INSERT INTO pokemon VALUES('귀뚤톡크',402,16,'벌레',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/402.png',16);
INSERT INTO pokemon VALUES('꼬링크',403,17,'전기',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/403.png',17);
INSERT INTO pokemon VALUES('럭시오',404,18,'전기',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/404.png',18);
INSERT INTO pokemon VALUES('렌트라',405,19,'전기',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/405.png',19);
INSERT INTO pokemon VALUES('캐이시',63,20,'에스퍼',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/63.png',20);
INSERT INTO pokemon VALUES('윤겔라',64,21,'에스퍼',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/64.png',21);
INSERT INTO pokemon VALUES('후딘',65,22,'에스퍼',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/65.png',22);
INSERT INTO pokemon VALUES('잉어킹',129,23,'물',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/129.png',23);
INSERT INTO pokemon VALUES('갸라도스',130,24,'물','비행','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png',24);
INSERT INTO pokemon VALUES('꼬몽울',406,25,'풀','독','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/406.png',25);
INSERT INTO pokemon VALUES('로젤리아',315,26,'풀','독','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/315.png',26);
INSERT INTO pokemon VALUES('로즈레이드',407,27,'풀','독','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/407.png',27);
INSERT INTO pokemon VALUES('주뱃',41,28,'독','비행','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/41.png',28);
INSERT INTO pokemon VALUES('골뱃',42,29,'독','비행','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/42.png',29);
INSERT INTO pokemon VALUES('크로뱃',169,30,'독','비행','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/169.png',30);
INSERT INTO pokemon VALUES('꼬마돌',74,31,'바위','땅','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/74.png',31);
INSERT INTO pokemon VALUES('데구리',75,32,'바위','땅','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/75.png',32);
INSERT INTO pokemon VALUES('딱구리',76,33,'바위','땅','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/76.png',33);
INSERT INTO pokemon VALUES('롱스톤',95,34,'바위','땅','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/95.png',34);
INSERT INTO pokemon VALUES('강철톤',208,35,'강철','땅','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/208.png',35);
INSERT INTO pokemon VALUES('두개도스',408,36,'바위',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/408.png',36);
INSERT INTO pokemon VALUES('램펄드',409,37,'바위',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/409.png',37);
INSERT INTO pokemon VALUES('방패톱스',410,38,'바위','강철','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/410.png',38);
INSERT INTO pokemon VALUES('바리톱스',411,39,'바위','강철','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/411.png',39);
INSERT INTO pokemon VALUES('알통몬',66,40,'격투',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/66.png',40);
INSERT INTO pokemon VALUES('근육몬',67,41,'격투',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/67.png',41);
INSERT INTO pokemon VALUES('괴력몬',68,42,'격투',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/68.png',42);
INSERT INTO pokemon VALUES('고라파덕',54,43,'물',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png',43);
INSERT INTO pokemon VALUES('골덕',55,44,'물',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/55.png',44);
INSERT INTO pokemon VALUES('도롱충이',412,45,'벌레',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/412.png',45);
INSERT INTO pokemon VALUES('도롱마담',413,46,'벌레','풀','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/413.png',46);
INSERT INTO pokemon VALUES('나메일',414,47,'벌레','비행','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/414.png',47);
INSERT INTO pokemon VALUES('개무소',265,48,'벌레',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/265.png',48);
INSERT INTO pokemon VALUES('실쿤',266,49,'벌레',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/266.png',49);
INSERT INTO pokemon VALUES('뷰티플라이',267,50,'벌레','비행','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/267.png',50);
INSERT INTO pokemon VALUES('카스쿤',268,51,'벌레',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/268.png',51);
INSERT INTO pokemon VALUES('독케일',269,52,'벌레','독','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/269.png',52);
INSERT INTO pokemon VALUES('세꿀버리',415,53,'벌레','비행','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/415.png',53);
INSERT INTO pokemon VALUES('비퀸',416,54,'벌레','비행','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/416.png',54);
INSERT INTO pokemon VALUES('파치리스',417,55,'전기',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/417.png',55);
INSERT INTO pokemon VALUES('브이젤',418,56,'물',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/418.png',56);
INSERT INTO pokemon VALUES('플로젤',419,57,'물',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/419.png',57);
INSERT INTO pokemon VALUES('체리버',420,58,'풀',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/420.png',58);
INSERT INTO pokemon VALUES('체리꼬',421,59,'풀',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/421.png',59);
INSERT INTO pokemon VALUES('깝질무',422,60,'물',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/422.png',60);
INSERT INTO pokemon VALUES('트리토돈',423,61,'물','땅','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/423.png',61);
INSERT INTO pokemon VALUES('헤라크로스',214,62,'벌레','격투','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/214.png',62);
INSERT INTO pokemon VALUES('에이팜',190,63,'노말',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/190.png',63);
INSERT INTO pokemon VALUES('겟핸보숭',424,64,'노말',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/424.png',64);
INSERT INTO pokemon VALUES('흔들풍손',425,65,'고스트','비행','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/425.png',65);
INSERT INTO pokemon VALUES('둥실라이드',426,66,'고스트','비행','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/426.png',66);
INSERT INTO pokemon VALUES('이어롤',427,67,'노말',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/427.png',67);
INSERT INTO pokemon VALUES('이어롭',428,68,'노말',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/428.png',68);
INSERT INTO pokemon VALUES('고오스',92,69,'고스트','독','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/92.png',69);
INSERT INTO pokemon VALUES('고우스트',93,70,'고스트','독','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/93.png',70);
INSERT INTO pokemon VALUES('팬텀',94,71,'고스트','독','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png',71);
INSERT INTO pokemon VALUES('무우마',200,72,'고스트',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/200.png',72);
INSERT INTO pokemon VALUES('무우마직',429,73,'고스트',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/429.png',73);
INSERT INTO pokemon VALUES('니로우',198,74,'악','비행','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/198.png',74);
INSERT INTO pokemon VALUES('돈크로우',430,75,'악','비행','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/430.png',75);
INSERT INTO pokemon VALUES('나옹마',431,76,'노말',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/431.png',76);
INSERT INTO pokemon VALUES('몬냥이',432,77,'노말',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/432.png',77);
INSERT INTO pokemon VALUES('콘치',118,78,'물',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/118.png',78);
INSERT INTO pokemon VALUES('왕콘치',119,79,'물',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/119.png',79);
INSERT INTO pokemon VALUES('미꾸리',339,80,'물','땅','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/339.png',80);
INSERT INTO pokemon VALUES('메깅',340,81,'물','땅','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/340.png',81);
INSERT INTO pokemon VALUES('랑딸랑',433,82,'에스퍼',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/433.png',82);
INSERT INTO pokemon VALUES('치렁',358,83,'에스퍼',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/358.png',83);
INSERT INTO pokemon VALUES('스컹뿡',434,84,'독','악','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/434.png',84);
INSERT INTO pokemon VALUES('스컹탱크',435,85,'독','악','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/435.png',85);
INSERT INTO pokemon VALUES('요가랑',307,86,'격투','에스퍼','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/307.png',86);
INSERT INTO pokemon VALUES('요가램',308,87,'격투','에스퍼','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/308.png',87);
INSERT INTO pokemon VALUES('동미러',436,88,'강철','에스퍼','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/436.png',88);
INSERT INTO pokemon VALUES('동탁군',437,89,'강철','에스퍼','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/437.png',89);
INSERT INTO pokemon VALUES('포니타',77,90,'불꽃',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/77.png',90);
INSERT INTO pokemon VALUES('날쌩마',78,91,'불꽃',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/78.png',91);
INSERT INTO pokemon VALUES('꼬지지',438,92,'바위',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/438.png',92);
INSERT INTO pokemon VALUES('꼬지모',185,93,'바위',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/185.png',93);
INSERT INTO pokemon VALUES('흉내내',439,94,'에스퍼',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/439.png',94);
INSERT INTO pokemon VALUES('마임맨',122,95,'에스퍼',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/122.png',95);
INSERT INTO pokemon VALUES('핑복',440,96,'노말',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/440.png',96);
INSERT INTO pokemon VALUES('럭키',113,97,'노말',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/113.png',97);
INSERT INTO pokemon VALUES('해피너스',242,98,'노말',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/242.png',98);
INSERT INTO pokemon VALUES('삐',173,99,'노말',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/173.png',99);
INSERT INTO pokemon VALUES('삐삐',35,100,'노말',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/35.png',100);
INSERT INTO pokemon VALUES('픽시',36,101,'노말',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/36.png',101);
INSERT INTO pokemon VALUES('페라페',441,102,'노말','비행','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/441.png',102);
INSERT INTO pokemon VALUES('피츄',172,103,'전기',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/172.png',103);
INSERT INTO pokemon VALUES('피카츄',25,104,'전기',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',104);
INSERT INTO pokemon VALUES('라이츄',26,105,'전기',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/26.png',105);
INSERT INTO pokemon VALUES('부우부',163,106,'노말','비행','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/163.png',106);
INSERT INTO pokemon VALUES('야부엉',164,107,'노말','비행','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/164.png',107);
INSERT INTO pokemon VALUES('화강돌',442,108,'고스트','악','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/442.png',108);
INSERT INTO pokemon VALUES('딥상어동',443,109,'드래곤','땅','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/443.png',109);
INSERT INTO pokemon VALUES('한바이트',444,110,'드래곤','땅','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/444.png',110);
INSERT INTO pokemon VALUES('한카리아스',445,111,'드래곤','땅','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/445.png',111);
INSERT INTO pokemon VALUES('먹고자',446,112,'노말',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/446.png',112);
INSERT INTO pokemon VALUES('잠만보',143,113,'노말',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png',113);
INSERT INTO pokemon VALUES('안농',201,114,'에스퍼',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/201.png',114);
INSERT INTO pokemon VALUES('리오르',447,115,'격투',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/447.png',115);
INSERT INTO pokemon VALUES('루카리오',448,116,'격투','강철','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/448.png',116);
INSERT INTO pokemon VALUES('우파',194,117,'물','땅','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/194.png',117);
INSERT INTO pokemon VALUES('누오',195,118,'물','땅','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/195.png',118);
INSERT INTO pokemon VALUES('갈모매',278,119,'물','비행','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/278.png',119);
INSERT INTO pokemon VALUES('패리퍼',279,120,'물','비행','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/279.png',120);
INSERT INTO pokemon VALUES('키링키',203,121,'노말','에스퍼','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/203.png',121);
INSERT INTO pokemon VALUES('히포포타스',449,122,'땅',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/449.png',122);
INSERT INTO pokemon VALUES('하마돈',450,123,'땅',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/450.png',123);
INSERT INTO pokemon VALUES('루리리',298,124,'노말',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/298.png',124);
INSERT INTO pokemon VALUES('마릴',183,125,'물',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/183.png',125);
INSERT INTO pokemon VALUES('마릴리',184,126,'물',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/184.png',126);
INSERT INTO pokemon VALUES('스콜피',451,127,'독','벌레','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/451.png',127);
INSERT INTO pokemon VALUES('드래피온',452,128,'독','악','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/452.png',128);
INSERT INTO pokemon VALUES('삐딱구리',453,129,'독','격투','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/453.png',129);
INSERT INTO pokemon VALUES('독개굴',454,130,'독','격투','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/454.png',130);
INSERT INTO pokemon VALUES('무스틈니',455,131,'풀',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/455.png',131);
INSERT INTO pokemon VALUES('총어',223,132,'물',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/223.png',132);
INSERT INTO pokemon VALUES('대포무노',224,133,'물',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/224.png',133);
INSERT INTO pokemon VALUES('형광어',456,134,'물',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/456.png',134);
INSERT INTO pokemon VALUES('네오라이트',457,135,'물',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/457.png',135);
INSERT INTO pokemon VALUES('왕눈해',72,136,'물','독','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/72.png',136);
INSERT INTO pokemon VALUES('독파리',73,137,'물','독','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/73.png',137);
INSERT INTO pokemon VALUES('빈티나',349,138,'물',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/349.png',138);
INSERT INTO pokemon VALUES('밀로틱',350,139,'물',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/350.png',139);
INSERT INTO pokemon VALUES('타만타',458,140,'물','비행','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/458.png',140);
INSERT INTO pokemon VALUES('만타인',226,141,'물','비행','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/226.png',141);
INSERT INTO pokemon VALUES('눈쓰개',459,142,'풀','얼음','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/459.png',142);
INSERT INTO pokemon VALUES('눈설왕',460,143,'풀','얼음','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/460.png',143);
INSERT INTO pokemon VALUES('포푸니',215,144,'악','얼음','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/215.png',144);
INSERT INTO pokemon VALUES('포푸니라',461,145,'악','얼음','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/461.png',145);
INSERT INTO pokemon VALUES('유크시',480,146,'에스퍼',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/480.png',146);
INSERT INTO pokemon VALUES('엠라이트',481,147,'에스퍼',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/481.png',147);
INSERT INTO pokemon VALUES('아그놈',482,148,'에스퍼',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/482.png',148);
INSERT INTO pokemon VALUES('디아루가',483,149,'강철','드래곤','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/483.png',149);
INSERT INTO pokemon VALUES('펄기아',484,150,'물','드래곤','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/484.png',150);
INSERT INTO pokemon VALUES('마나피',490,151,'물',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/490.png',151);
INSERT INTO pokemon VALUES('로토무',479,152,'전기','고스트','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/479.png',152);
INSERT INTO pokemon VALUES('글라이거',207,153,'땅','비행','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/207.png',153);
INSERT INTO pokemon VALUES('글라이온',472,154,'땅','비행','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/472.png',154);
INSERT INTO pokemon VALUES('코코파스',299,155,'바위',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/299.png',155);
INSERT INTO pokemon VALUES('대코파스',476,156,'바위','강철','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/476.png',156);
INSERT INTO pokemon VALUES('랄토스',280,157,'에스퍼',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/280.png',157);
INSERT INTO pokemon VALUES('킬리아',281,158,'에스퍼',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/281.png',158);
INSERT INTO pokemon VALUES('가디안',282,159,'에스퍼',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/282.png',159);
INSERT INTO pokemon VALUES('엘레이드',475,160,'에스퍼','격투','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/475.png',160);
INSERT INTO pokemon VALUES('내루미',108,161,'노말',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/108.png',161);
INSERT INTO pokemon VALUES('내룸벨트',463,162,'노말',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/463.png',162);
INSERT INTO pokemon VALUES('이브이',133,163,'노말',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png',163);
INSERT INTO pokemon VALUES('샤미드',134,164,'물',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/134.png',164);
INSERT INTO pokemon VALUES('쥬피썬더',135,165,'전기',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/135.png',165);
INSERT INTO pokemon VALUES('부스터',136,166,'불꽃',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/136.png',166);
INSERT INTO pokemon VALUES('에브이',196,167,'에스퍼',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/196.png',167);
INSERT INTO pokemon VALUES('블래키',197,168,'악',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/197.png',168);
INSERT INTO pokemon VALUES('리피아',470,169,'풀',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/470.png',169);
INSERT INTO pokemon VALUES('글레이시아',471,170,'얼음',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/471.png',170);
INSERT INTO pokemon VALUES('파비코',333,171,'노말','비행','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/333.png',171);
INSERT INTO pokemon VALUES('파비코리',334,172,'드래곤','비행','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/334.png',172);
INSERT INTO pokemon VALUES('토게피',175,173,'노말',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/175.png',173);
INSERT INTO pokemon VALUES('토게틱',176,174,'노말','비행','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/176.png',174);
INSERT INTO pokemon VALUES('토게키스',468,175,'노말','비행','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/468.png',175);
INSERT INTO pokemon VALUES('델빌',228,176,'악','불꽃','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/228.png',176);
INSERT INTO pokemon VALUES('헬가',229,177,'악','불꽃','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/229.png',177);
INSERT INTO pokemon VALUES('코일',81,178,'전기','강철','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/81.png',178);
INSERT INTO pokemon VALUES('레어코일',82,179,'전기','강철','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/82.png',179);
INSERT INTO pokemon VALUES('자포코일',462,180,'전기','강철','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/462.png',180);
INSERT INTO pokemon VALUES('덩쿠리',114,181,'풀',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/114.png',181);
INSERT INTO pokemon VALUES('덩쿠림보',465,182,'풀',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/465.png',182);
INSERT INTO pokemon VALUES('왕자리',193,183,'벌레','비행','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/193.png',183);
INSERT INTO pokemon VALUES('메가자리',469,184,'벌레','비행','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/469.png',184);
INSERT INTO pokemon VALUES('트로피우스',357,185,'풀','비행','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/357.png',185);
INSERT INTO pokemon VALUES('뿔카노',111,186,'땅','바위','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/111.png',186);
INSERT INTO pokemon VALUES('코뿌리',112,187,'땅','바위','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/112.png',187);
INSERT INTO pokemon VALUES('거대코뿌리',464,188,'땅','바위','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/464.png',188);
INSERT INTO pokemon VALUES('해골몽',355,189,'고스트',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/355.png',189);
INSERT INTO pokemon VALUES('미라몽',356,190,'고스트',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/356.png',190);
INSERT INTO pokemon VALUES('야느와르몽',477,191,'고스트',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/477.png',191);
INSERT INTO pokemon VALUES('폴리곤',137,192,'노말',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/137.png',192);
INSERT INTO pokemon VALUES('폴리곤2',233,193,'노말',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/233.png',193);
INSERT INTO pokemon VALUES('폴리곤Z',474,194,'노말',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/474.png',194);
INSERT INTO pokemon VALUES('스라크',123,195,'벌레','비행','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/123.png',195);
INSERT INTO pokemon VALUES('핫삼',212,196,'벌레','강철','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/212.png',196);
INSERT INTO pokemon VALUES('에레키드',239,197,'전기',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/239.png',197);
INSERT INTO pokemon VALUES('에레브',125,198,'전기',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/125.png',198);
INSERT INTO pokemon VALUES('에레키블',466,199,'전기',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/466.png',199);
INSERT INTO pokemon VALUES('마그비',240,200,'불꽃',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/240.png',200);
INSERT INTO pokemon VALUES('마그마',126,201,'불꽃',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/126.png',201);
INSERT INTO pokemon VALUES('마그마번',467,202,'불꽃',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/467.png',202);
INSERT INTO pokemon VALUES('꾸꾸리',220,203,'얼음','땅','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/220.png',203);
INSERT INTO pokemon VALUES('메꾸리',221,204,'얼음','땅','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/221.png',204);
INSERT INTO pokemon VALUES('맘모꾸리',473,205,'얼음','땅','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/473.png',205);
INSERT INTO pokemon VALUES('눈꼬마',361,206,'얼음',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/361.png',206);
INSERT INTO pokemon VALUES('얼음귀신',362,207,'얼음',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/362.png',207);
INSERT INTO pokemon VALUES('눈여아',478,208,'얼음','고스트','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/478.png',208);
INSERT INTO pokemon VALUES('앱솔',359,209,'악',NULL,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/359.png',209);
INSERT INTO pokemon VALUES('기라티나',487,210,'고스트','드래곤','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/487.png',210);
CREATE TABLE badge (
	id INTEGER NOT NULL, 
	name VARCHAR NOT NULL, 
	criteria_description VARCHAR NOT NULL, 
	PRIMARY KEY (id)
);
CREATE TABLE dailyencounterlog (
	location_gpt VARCHAR NOT NULL, 
	environment_gpt VARCHAR NOT NULL, 
	time_gpt VARCHAR NOT NULL, 
	season_gpt VARCHAR NOT NULL, 
	user_reflection VARCHAR NOT NULL, 
	photo_url VARCHAR, 
	created_at DATETIME NOT NULL, 
	id INTEGER NOT NULL, 
	user_id INTEGER NOT NULL, 
	pokemon_id INTEGER NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES user (id), 
	FOREIGN KEY(pokemon_id) REFERENCES pokemon (id)
);
INSERT INTO dailyencounterlog VALUES('도시','맑음','낮','여름','아름다운 강을 보았어','TODO: 이미지 저장소 URL','2025-11-08 13:55:06.181170',1,1,60);
INSERT INTO dailyencounterlog VALUES('도시','맑음','낮','여름','피곤한 하루였어.','TODO: 이미지 저장소 URL','2025-11-10 10:58:17.607663',2,1,171);
INSERT INTO dailyencounterlog VALUES('숲','흐림','낮','가을','숲속에서 맛있는 걸 많이 먹었다.','TODO: 이미지 저장소 URL','2025-11-10 15:15:43.305536',3,1,40);
INSERT INTO dailyencounterlog VALUES('도시','맑음','낮','여름','힘든 하루였다','TODO: 이미지 저장소 URL','2025-11-10 15:48:56.550174',4,1,121);
INSERT INTO dailyencounterlog VALUES('산','맑음','아침','봄','프로젝트가 완성되어 가니까 기분이 좋다.','TODO: 이미지 저장소 URL','2025-11-11 07:19:41.410325',5,1,149);
INSERT INTO dailyencounterlog VALUES('산','맑음','일몰','가을','개발이 얼추 잘 되가고 있는 것 같다.','http://localhost:8000/uploads/20251112_132436_4e2c65e4.jpeg','2025-11-12 04:24:36.215244',6,1,118);
INSERT INTO dailyencounterlog VALUES('도시','맑음','낮','가을','카페에 와서 아메리카노를 마셨다. 문득 창 밖을 보는데 단풍이 예쁘게 들어있었다.','http://localhost:8000/uploads/20251112_132657_ef302d18.jpeg','2025-11-12 04:26:57.375412',7,1,183);
INSERT INTO dailyencounterlog VALUES('산','맑음','아침','여름','집에 가고싶다.','http://localhost:8000/uploads/1/20251112_134231_d7293ac8.png','2025-11-12 04:42:31.749788',8,1,189);
INSERT INTO dailyencounterlog VALUES('산','맑음','아침','여름','다른 계정의 이미지를 테스트해보자','http://localhost:8000/uploads/2/20251112_134520_01cc0428.png','2025-11-12 04:45:20.616155',9,2,196);
INSERT INTO dailyencounterlog VALUES('도시','맑음','낮','가을',replace(replace('사진 저장 방식을 바꿔 다시 테스트한다\r\n','\r',char(13)),'\n',char(10)),'http://localhost:8000/uploads/1/20251112_134803_608ad1e1.jpeg','2025-11-12 04:48:03.211887',10,1,61);
INSERT INTO dailyencounterlog VALUES('산','맑음','일몰','가을',replace(replace('펄기아 만날 수 있게 해줘\r\n','\r',char(13)),'\n',char(10)),'http://localhost:8000/uploads/1/20251112_134821_3020295d.jpeg','2025-11-12 04:48:21.741259',11,1,86);
INSERT INTO dailyencounterlog VALUES('산','맑음','일몰','가을','테스트용','TODO: 이미지 저장소 URL','2025-11-14 16:45:34.510417',12,1,116);
INSERT INTO dailyencounterlog VALUES('도시','맑음','낮','여름','이제 진짜 됐나?','/uploads/1/20251114_170326.png','2025-11-14 17:03:26.307980',13,1,81);
INSERT INTO dailyencounterlog VALUES('산','맑음','아침','봄','테스트 일지 1: 몬스터볼과 함께 시작!','/useImage/몬스터볼.webp','2025-11-12 04:38:30',14,4,1);
INSERT INTO dailyencounterlog VALUES('들','맑음','낮','여름','테스트 일지 2: 프리미어볼과 함께한 하루.','/useImage/프리미어볼.webp','2025-11-13 04:38:30',15,4,2);
INSERT INTO dailyencounterlog VALUES('강','흐림','오후','가을','테스트 일지 3: 슈퍼볼 덕분에 포켓몬을 만났다.','/useImage/슈퍼볼.webp','2025-11-14 04:38:30',16,4,3);
INSERT INTO dailyencounterlog VALUES('숲','비','저녁','겨울','테스트 일지 4: 하이퍼볼로 힘든 배틀을 이겼다.','/useImage/하이퍼볼.webp','2025-11-15 04:38:30',17,4,4);
INSERT INTO dailyencounterlog VALUES('도시','맑음','밤','봄','테스트 일지 5: 마스터볼은 역시 든든하다.','/useImage/마스터볼.webp','2025-11-16 04:38:30',18,4,5);
INSERT INTO dailyencounterlog VALUES('도시','맑음','낮','가을','오늘은 카페에 가서 공부를 했다. 문득 고개를 들어보니 단풍이 예뻐 나도 모르게 사진부터 찍었다. 하늘도 파란걸 보니 가을느낌이 물씬 풍긴다.','/uploads/4/20251116_054534.jpeg','2025-11-16 05:45:34.604104',19,4,97);
INSERT INTO dailyencounterlog VALUES('도시','맑음','낮','가을','오늘은 카페에 가서 공부를 했다. 문득 고개를 들어보니 단풍이 예뻐 나도 모르게 사진부터 찍었다. 하늘도 파란걸 보니 가을느낌이 물씬 풍긴다.','/uploads/4/20251116_055958.jpeg','2025-11-16 05:59:58.484433',20,4,198);
CREATE UNIQUE INDEX ix_user_email ON user (email);
CREATE INDEX ix_pokemon_poke_id ON pokemon (poke_id);
CREATE INDEX ix_pokemon_name ON pokemon (name);
CREATE INDEX ix_pokemon_sinnoh_poke_id ON pokemon (sinnoh_poke_id);
CREATE INDEX ix_badge_name ON badge (name);
COMMIT;
