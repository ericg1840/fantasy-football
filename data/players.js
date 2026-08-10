/* Seed player data for the fantasy football draft/season tracker.
   Source: FantasyPros consensus 2026 draft rankings (overall cheat sheet),
   PDF export dated 8/9/26. Ranks/tiers/byes reflect that snapshot and will
   drift as the preseason progresses (trades, depth-chart news, injuries).
   Re-import an updated export any time via the Import/Export tab. */

const SEED_PLAYERS = [
  // --- RB ---
  ["Jahmyr Gibbs","RB","DET",6,1],
  ["Bijan Robinson","RB","ATL",11,1],
  // --- WR ---
  ["Ja'Marr Chase","WR","CIN",6,1],
  ["Puka Nacua","WR","LAR",11,1],
  ["Jaxon Smith-Njigba","WR","SEA",11,2],
  ["Amon-Ra St. Brown","WR","DET",6,2],
  // --- RB ---
  ["Jonathan Taylor","RB","IND",13,2],
  ["Christian McCaffrey","RB","SF",8,2],
  // --- WR ---
  ["CeeDee Lamb","WR","DAL",14,2],
  // --- RB ---
  ["James Cook III","RB","BUF",7,2],
  // --- WR ---
  ["Justin Jefferson","WR","MIN",6,2],
  // --- RB ---
  ["Derrick Henry","RB","BAL",13,3],
  // --- WR ---
  ["Nico Collins","WR","HOU",8,3],
  ["A.J. Brown","WR","NE",11,3],
  ["Drake London","WR","ATL",11,3],
  // --- RB ---
  ["Saquon Barkley","RB","PHI",10,3],
  // --- TE ---
  ["Brock Bowers","TE","LV",13,3],
  // --- WR ---
  ["George Pickens","WR","DAL",14,3],
  // --- RB ---
  ["Ashton Jeanty","RB","LV",13,3],
  ["Omarion Hampton","RB","LAC",7,3],
  // --- TE ---
  ["Trey McBride","TE","ARI",14,4],
  // --- QB ---
  ["Josh Allen","QB","BUF",7,4],
  // --- RB ---
  ["Kenneth Walker III","RB","KC",5,4],
  ["Chase Brown","RB","CIN",6,4],
  ["De'Von Achane","RB","MIA",6,4],
  // --- WR ---
  ["Rashee Rice","WR","KC",5,4],
  ["Chris Olave","WR","NO",8,4],
  // --- QB ---
  ["Lamar Jackson","QB","BAL",13,4],
  // --- RB ---
  ["Kyren Williams","RB","LAR",11,4],
  // --- WR ---
  ["Zay Flowers","WR","BAL",13,4],
  ["Tee Higgins","WR","CIN",6,4],
  ["DeVonta Smith","WR","PHI",10,4],
  ["Malik Nabers","WR","NYG",8,4],
  // --- QB ---
  ["Drake Maye","QB","NE",11,4],
  // --- RB ---
  ["Josh Jacobs","RB","GB",11,4],
  // --- WR ---
  ["Emeka Egbuka","WR","TB",10,4],
  ["Tetairoa McMillan","WR","CAR",5,4],
  // --- RB ---
  ["Javonte Williams","RB","DAL",14,5],
  // --- TE ---
  ["Colston Loveland","TE","CHI",10,5],
  // --- RB ---
  ["Breece Hall","RB","NYJ",13,5],
  ["Jeremiyah Love","RB","ARI",14,5],
  // --- QB ---
  ["Joe Burrow","QB","CIN",6,5],
  // --- WR ---
  ["Davante Adams","WR","LAR",11,5],
  ["Ladd McConkey","WR","LAC",7,5],
  ["Jameson Williams","WR","DET",6,5],
  ["Terry McLaurin","WR","WAS",7,5],
  ["Jaylen Waddle","WR","DEN",10,5],
  ["Christian Watson","WR","GB",11,5],
  // --- RB ---
  ["Travis Etienne Jr.","RB","NO",8,5],
  // --- QB ---
  ["Jayden Daniels","QB","WAS",7,5],
  // --- WR ---
  ["Garrett Wilson","WR","NYJ",13,6],
  // --- RB ---
  ["Cam Skattebo","RB","NYG",8,6],
  // --- WR ---
  ["Mike Evans","WR","SF",8,6],
  // --- RB ---
  ["Quinshon Judkins","RB","CLE",11,6],
  // --- WR ---
  ["Luther Burden III","WR","CHI",10,6],
  // --- RB ---
  ["D'Andre Swift","RB","CHI",10,6],
  // --- WR ---
  ["Rome Odunze","WR","CHI",10,6],
  // --- QB ---
  ["Jalen Hurts","QB","PHI",10,6],
  // --- RB ---
  ["Bucky Irving","RB","TB",10,6],
  ["David Montgomery","RB","HOU",8,6],
  // --- TE ---
  ["Tucker Kraft","TE","GB",11,6],
  // --- RB ---
  ["TreVeyon Henderson","RB","NE",11,6],
  // --- WR ---
  ["DJ Moore","WR","BUF",7,6],
  // --- RB ---
  ["Bhayshul Tuten","RB","JAC",7,6],
  // --- TE ---
  ["Tyler Warren","TE","IND",13,6],
  // --- RB ---
  ["Jadarian Price","RB","SEA",11,6],
  // --- QB ---
  ["Caleb Williams","QB","CHI",10,6],
  ["Justin Herbert","QB","LAC",7,6],
  // --- WR ---
  ["Marvin Harrison Jr.","WR","ARI",14,7],
  ["Brian Thomas Jr.","WR","JAC",7,7],
  ["Carnell Tate","WR","TEN",9,7],
  // --- RB ---
  ["Jaylen Warren","RB","PIT",9,7],
  ["Tony Pollard","RB","TEN",9,7],
  // --- WR ---
  ["Alec Pierce","WR","IND",13,7],
  // --- QB ---
  ["Trevor Lawrence","QB","JAC",7,7],
  // --- WR ---
  ["DK Metcalf","WR","PIT",9,7],
  // --- TE ---
  ["Sam LaPorta","TE","DET",6,7],
  // --- QB ---
  ["Dak Prescott","QB","DAL",14,7],
  // --- RB ---
  ["Rhamondre Stevenson","RB","NE",11,7],
  // --- WR ---
  ["Parker Washington","WR","JAC",7,7],
  // --- RB ---
  ["Chuba Hubbard","RB","CAR",5,7],
  ["Rico Dowdle","RB","PIT",9,7],
  // --- WR ---
  ["Courtland Sutton","WR","DEN",10,7],
  // --- RB ---
  ["J.K. Dobbins","RB","DEN",10,7],
  // --- TE ---
  ["Harold Fannin Jr.","TE","CLE",11,7],
  ["Kyle Pitts Sr.","TE","ATL",11,7],
  // --- RB ---
  ["Blake Corum","RB","LAR",11,7],
  // --- WR ---
  ["Quentin Johnston","WR","LAC",7,7],
  // --- QB ---
  ["Jaxson Dart","QB","NYG",8,7],
  // --- RB ---
  ["Kyle Monangai","RB","CHI",10,7],
  // --- QB ---
  ["Brock Purdy","QB","SF",8,7],
  // --- WR ---
  ["Jordyn Tyson","WR","NO",8,7],
  ["Chris Godwin Jr.","WR","TB",10,7],
  ["Jordan Addison","WR","MIN",6,8],
  // --- RB ---
  ["RJ Harvey","RB","DEN",10,8],
  // --- TE ---
  ["George Kittle","TE","SF",8,8],
  // --- QB ---
  ["Bo Nix","QB","DEN",10,8],
  // --- WR ---
  ["Michael Wilson","WR","ARI",14,8],
  // --- QB ---
  ["Patrick Mahomes II","QB","KC",5,8],
  // --- RB ---
  ["Jacory Croskey-Merritt","RB","WAS",7,8],
  // --- QB ---
  ["Matthew Stafford","QB","LAR",11,8],
  // --- TE ---
  ["Dalton Kincaid","TE","BUF",7,8],
  // --- WR ---
  ["Makai Lemon","WR","PHI",10,8],
  ["Jayden Reed","WR","GB",11,8],
  // --- TE ---
  ["Travis Kelce","TE","KC",5,8],
  // --- QB ---
  ["Jared Goff","QB","DET",6,8],
  // --- RB ---
  ["Jordan Mason","RB","MIN",6,8],
  ["Rachaad White","RB","WAS",7,8],
  ["Jonathon Brooks","RB","CAR",5,8],
  // --- WR ---
  ["Michael Pittman Jr.","WR","PIT",9,8],
  // --- RB ---
  ["Aaron Jones Sr.","RB","MIN",6,8],
  ["Kenny Gainwell","RB","TB",10,8],
  // --- TE ---
  ["Mark Andrews","TE","BAL",13,8],
  ["Dallas Goedert","TE","PHI",10,8],
  // --- QB ---
  ["Kyler Murray","QB","MIN",6,8],
  // --- WR ---
  ["Jakobi Meyers","WR","JAC",7,8],
  ["Xavier Worthy","WR","KC",5,8],
  // --- TE ---
  ["Isaiah Likely","TE","NYG",8,8],
  // --- QB ---
  ["Baker Mayfield","QB","TB",10,8],
  // --- WR ---
  ["Josh Downs","WR","IND",13,8],
  // --- QB ---
  ["Jordan Love","QB","GB",11,8],
  // --- WR ---
  ["Wan'Dale Robinson","WR","TEN",9,8],
  // --- RB ---
  ["Chris Rodriguez Jr.","RB","JAC",7,8],
  // --- QB ---
  ["Tyler Shough","QB","NO",8,8],
  // --- WR ---
  ["Jayden Higgins","WR","HOU",8,8],
  // --- TE ---
  ["Jake Ferguson","TE","DAL",14,8],
  // --- WR ---
  ["Romeo Doubs","WR","NE",11,8],
  // --- RB ---
  ["Tyrone Tracy Jr.","RB","NYG",8,9],
  ["Tyler Allgeier","RB","ARI",14,9],
  ["Woody Marks","RB","HOU",8,9],
  ["Zach Charbonnet","RB","SEA",11,9],
  // --- WR ---
  ["Jalen Coker","WR","CAR",5,9],
  ["Matthew Golden","WR","GB",11,9],
  // --- QB ---
  ["Malik Willis","QB","MIA",6,9],
  // --- WR ---
  ["Rashid Shaheed","WR","SEA",11,9],
  ["Khalil Shakir","WR","BUF",7,9],
  ["KC Concepcion","WR","CLE",11,9],
  // --- QB ---
  ["Sam Darnold","QB","SEA",11,9],
  // --- RB ---
  ["Isiah Pacheco","RB","DET",6,9],
  ["Tank Bigsby","RB","PHI",10,9],
  // --- QB ---
  ["C.J. Stroud","QB","HOU",8,9],
  // --- RB ---
  ["Brian Robinson Jr.","RB","ATL",11,9],
  ["Alvin Kamara","RB","NO",8,9],
  ["Keaton Mitchell","RB","LAC",7,9],
  // --- TE ---
  ["Brenton Strange","TE","JAC",7,9],
  ["Hunter Henry","TE","NE",11,9],
  ["Juwan Johnson","TE","NO",8,9],
  // --- RB ---
  ["Tyjae Spears","RB","TEN",9,9],
  // --- TE ---
  ["Oronde Gadsden II","TE","LAC",7,9],
  // --- WR ---
  ["Deebo Samuel Sr.","WR","SF",8,9],
  // --- RB ---
  ["Dylan Sampson","RB","CLE",11,9],
  // --- WR ---
  ["Jauan Jennings","WR","MIN",6,9],
  // --- QB ---
  ["Cam Ward","QB","TEN",9,9],
  ["Daniel Jones","QB","IND",13,9],
  // --- RB ---
  ["Jonah Coleman","RB","DEN",10,9],
  // --- TE ---
  ["Chig Okonkwo","TE","WAS",7,9],
  // --- DST ---
  ["Houston Texans","DST","HOU",8,9],
  // --- WR ---
  ["Jerry Jeudy","WR","CLE",11,9],
  ["Stefon Diggs","WR","WAS",7,9],
  ["Adonai Mitchell","WR","NYJ",13,9],
  // --- RB ---
  ["Braelon Allen","RB","NYJ",13,9],
  // --- WR ---
  ["Jalen McMillan","WR","TB",10,10],
  ["Denzel Boston","WR","CLE",11,10],
  ["Omar Cooper Jr.","WR","NYJ",13,10],
  ["Travis Hunter","WR","JAC",7,10],
  ["Tre Tucker","WR","LV",13,10],
  // --- QB ---
  ["Bryce Young","QB","CAR",5,10],
  // --- DST ---
  ["Denver Broncos","DST","DEN",10,10],
  ["Seattle Seahawks","DST","SEA",11,10],
  ["Los Angeles Rams","DST","LAR",11,10],
  // --- WR ---
  ["Kayshon Boutte","WR","NE",11,10],
  ["Tre' Harris","WR","LAC",7,10],
  // --- DST ---
  ["Philadelphia Eagles","DST","PHI",10,10],
  // --- RB ---
  ["Kimani Vidal","RB","LAC",7,10],
  // --- WR ---
  ["De'Zhaun Stribling","WR","SF",8,10],
  // --- RB ---
  ["Emanuel Wilson","RB","SEA",11,10],
  // --- TE ---
  ["AJ Barner","TE","SEA",11,10],
  // --- WR ---
  ["Ryan Flournoy","WR","DAL",14,10],
  // --- RB ---
  ["Emmett Johnson","RB","KC",5,10],
  ["Ray Davis","RB","BUF",7,10],
  // --- WR ---
  ["Calvin Ridley","WR","TEN",9,10],
  // --- TE ---
  ["Kenyon Sadiq","TE","NYJ",13,10],
  // --- RB ---
  ["Sean Tucker","RB","TB",10,10],
  // --- K ---
  ["Brandon Aubrey","K","DAL",14,10],
  // --- DST ---
  ["Minnesota Vikings","DST","MIN",6,10],
  // --- WR ---
  ["Jalen Nailor","WR","LV",13,10],
  // --- TE ---
  ["Dalton Schultz","TE","HOU",8,10],
  // --- DST ---
  ["Jacksonville Jaguars","DST","JAC",7,10],
  // --- RB ---
  ["James Conner","RB","ARI",14,10],
  // --- DST ---
  ["New England Patriots","DST","NE",11,10],
  ["Pittsburgh Steelers","DST","PIT",9,10],
  // --- RB ---
  ["Mike Washington Jr.","RB","LV",13,10],
  // --- TE ---
  ["Terrance Ferguson","TE","LAR",11,10],
  // --- DST ---
  ["Los Angeles Chargers","DST","LAC",7,10],
  // --- K ---
  ["Ka'imi Fairbairn","K","HOU",8,10],
  // --- QB ---
  ["Jacoby Brissett","QB","ARI",14,10],
  // --- RB ---
  ["Nicholas Singleton","RB","TEN",9,10],
  // --- K ---
  ["Cameron Dicker","K","LAC",7,10],
  // --- WR ---
  ["Rashod Bateman","WR","BAL",13,10],
  ["Isaac TeSlaa","WR","DET",6,10],
  ["Troy Franklin","WR","DEN",10,10],
  ["Dontayvion Wicks","WR","PHI",10,10],
  // --- K ---
  ["Cam Little","K","JAC",7,11],
  // --- DST ---
  ["Baltimore Ravens","DST","BAL",13,11],
  // --- RB ---
  ["Kaytron Allen","RB","WAS",7,11],
  // --- WR ---
  ["Darnell Mooney","WR","NYG",8,11],
  // --- K ---
  ["Jason Myers","K","SEA",11,11],
  // --- WR ---
  ["Jaylin Noel","WR","HOU",8,11],
  // --- RB ---
  ["MarShawn Lloyd","RB","GB",11,11],
  // --- TE ---
  ["T.J. Hockenson","TE","MIN",6,11],
  // --- DST ---
  ["Green Bay Packers","DST","GB",11,11],
  // --- K ---
  ["Eddy Pineiro","K","SF",8,11],
  ["Tyler Loop","K","BAL",13,11],
  // --- WR ---
  ["Antonio Williams","WR","WAS",7,11],
  ["Malik Washington","WR","MIA",6,11],
  ["Pat Bryant","WR","DEN",10,11],
  // --- RB ---
  ["Jaylen Wright","RB","MIA",6,11],
  // --- WR ---
  ["Tank Dell","WR","HOU",8,11],
  // --- DST ---
  ["Kansas City Chiefs","DST","KC",5,11],
  // --- RB ---
  ["Jaydon Blue","RB","DAL",14,11],
  ["Ollie Gordon II","RB","MIA",6,11],
  // --- TE ---
  ["Gunnar Helm","TE","TEN",9,11],
  ["Pat Freiermuth","TE","PIT",9,11],
  // --- DST ---
  ["Detroit Lions","DST","DET",6,11],
  // --- K ---
  ["Evan McPherson","K","CIN",6,11],
  ["Cairo Santos","K","CHI",10,11],
  // --- DST ---
  ["Cleveland Browns","DST","CLE",11,11],
  // --- K ---
  ["Andy Borregales","K","NE",11,11],
  ["Jake Bates","K","DET",6,11],
  // --- WR ---
  ["Cooper Kupp","WR","SEA",11,11],
  // --- QB ---
  ["Aaron Rodgers","QB","PIT",9,11],
  // --- WR ---
  ["Zachariah Branch","WR","ATL",11,11],
  // --- QB ---
  ["Geno Smith","QB","NYJ",13,11],
  // --- TE ---
  ["David Njoku","TE","LAC",7,11],
  // --- WR ---
  ["Chimere Dike","WR","TEN",9,11],
  // --- DST ---
  ["Buffalo Bills","DST","BUF",7,11],
  // --- TE ---
  ["Cade Otton","TE","TB",10,11],
  // --- K ---
  ["Chase McLaughlin","K","TB",10,11],
  // --- WR ---
  ["Elic Ayomanor","WR","TEN",9,11],
  ["Keon Coleman","WR","BUF",7,11],
  // --- K ---
  ["Harrison Mevis","K","LAR",11,11],
  // --- TE ---
  ["Greg Dulcich","TE","MIA",6,11],
  // --- WR ---
  ["Germie Bernard","WR","PIT",9,11],
  // --- RB ---
  ["Demond Claiborne","RB","MIN",6,11],
  // --- K ---
  ["Chris Boswell","K","PIT",9,11],
  // --- TE ---
  ["Colby Parkinson","TE","LAR",11,11],
  // --- K ---
  ["Harrison Butker","K","KC",5,11],
  // --- RB ---
  ["George Holani","RB","SEA",11,11],
  // --- TE ---
  ["Evan Engram","TE","DEN",10,12],
  // --- WR ---
  ["Tory Horton","WR","SEA",11,12],
  // --- RB ---
  ["Jordan James","RB","SF",8,12],
  ["Malik Davis","RB","DAL",14,12],
  ["Justice Hill","RB","BAL",13,12],
  // --- WR ---
  ["Jack Bech","WR","LV",13,12],
  // --- RB ---
  ["Isaiah Davis","RB","NYJ",13,12],
  // --- TE ---
  ["Eli Stowers","TE","PHI",10,12],
  // --- RB ---
  ["Devin Neal","RB","NO",8,12],
  // --- WR ---
  ["Elijah Sarratt","WR","BAL",13,12],
  ["Tyquan Thornton","WR","KC",5,12],
  // --- RB ---
  ["Kaelon Black","RB","SF",8,12],
  // --- QB ---
  ["Fernando Mendoza","QB","LV",13,12],
  // --- RB ---
  ["Trey Benson","RB","ARI",14,12],
  ["Ty Johnson","RB","BUF",7,12],
  // --- WR ---
  ["Ted Hurst III","WR","TB",10,12],
  // --- RB ---
  ["DJ Giddens","RB","IND",13,12],
  ["Chris Brooks","RB","GB",11,12],
  // --- TE ---
  ["Theo Johnson","TE","NYG",8,12],
  // --- QB ---
  ["Tua Tagovailoa","QB","ATL",11,12],
  // --- WR ---
  ["Christian Kirk","WR","SF",8,12],
  // --- K ---
  ["Wil Lutz","K","DEN",10,12],
  // --- WR ---
  ["Chris Bell","WR","MIA",6,12],
  ["Malachi Fields","WR","NYG",8,12],
  ["Darius Slayton","WR","NYG",8,12],
  ["Brandon Aiyuk","WR","SF",8,12],
  // --- TE ---
  ["Mason Taylor","TE","NYJ",13,12],
  // --- RB ---
  ["Samaje Perine","RB","CIN",6,12],
  // --- WR ---
  ["Marvin Mims Jr.","WR","DEN",10,12],
  // --- K ---
  ["Will Reichard","K","MIN",6,12],
  // --- WR ---
  ["Xavier Legette","WR","CAR",5,12],
  // --- DST ---
  ["San Francisco 49ers","DST","SF",8,12],
  // --- RB ---
  ["Kaleb Johnson","RB","PIT",9,12],
  // --- DST ---
  ["Atlanta Falcons","DST","ATL",11,12],
  // --- WR ---
  ["Devaughn Vele","WR","NO",8,12],
  // --- RB ---
  ["Kendre Miller","RB","NO",8,12],
  ["Emari Demercado","RB","KC",5,12],
  // --- TE ---
  ["Oscar Delp","TE","NO",8,12],
  // --- RB ---
  ["Devin Singletary","RB","NYG",8,12],
  // --- QB ---
  ["Michael Penix Jr.","QB","ATL",11,12],
  // --- WR ---
  ["Hollywood Brown","WR","PHI",10,12],
  ["Kyle Williams","WR","NE",11,12],
  ["Ja'Kobi Lane","WR","BAL",13,12],
  // --- TE ---
  ["Mike Gesicki","TE","CIN",6,12],
  // --- RB ---
  ["Adam Randall","RB","BAL",13,12],
  // --- QB ---
  ["Kirk Cousins","QB","LV",13,12],
  // --- WR ---
  ["Keenan Allen","WR","LAC",7,12],
  ["Tyreek Hill","WR","FA",0,12],
  // --- QB ---
  ["Deshaun Watson","QB","CLE",11,12],
  ["Shedeur Sanders","QB","CLE",11,12],
  // --- WR ---
  ["Mack Hollins","WR","NE",11,12],
  // --- RB ---
  ["LeQuint Allen Jr.","RB","JAC",7,12],
  ["Jerome Ford","RB","WAS",7,12],
  ["Seth McGowan","RB","IND",13,12],
  // --- WR ---
  ["Skyler Bell","WR","BUF",7,12],
  // --- DST ---
  ["New Orleans Saints","DST","NO",8,12],
  // --- RB ---
  ["Brashard Smith","RB","KC",5,12],
  ["Najee Harris","RB","LAC",7,12],
  // --- WR ---
  ["Isaiah Bond","WR","CLE",11,13],
  // --- TE ---
  ["Jake Tonges","TE","SF",8,13],
  // --- RB ---
  ["Isaac Guerendo","RB","SF",8,13],
  ["Trevor Etienne","RB","CAR",5,13],
  // --- K ---
  ["Charlie Smyth","K","NO",8,13],
  // --- DST ---
  ["Indianapolis Colts","DST","IND",13,13],
  // --- RB ---
  ["Tahj Brooks","RB","CIN",6,13],
  // --- WR ---
  ["Andrei Iosivas","WR","CIN",6,13],
  // --- DST ---
  ["Chicago Bears","DST","CHI",10,13],
  // --- TE ---
  ["Darnell Washington","TE","PIT",9,13],
  // --- RB ---
  ["Jarquez Hunter","RB","LAR",11,13],
  ["Jaleel McLaughlin","RB","DEN",10,13],
  // --- WR ---
  ["Caleb Douglas","WR","MIA",6,13],
  ["Cyrus Allen","WR","KC",5,13],
  ["Chris Brazzell II","WR","CAR",5,13],
  // --- RB ---
  ["Audric Estime","RB","NO",8,13],
  // --- WR ---
  ["Luke McCaffrey","WR","WAS",7,13],
  ["Cedric Tillman","WR","CLE",11,13],
  // --- RB ---
  ["Will Shipley","RB","PHI",10,13],
  // --- WR ---
  ["Tez Johnson","WR","TB",10,13],
  // --- RB ---
  ["Joe Mixon","RB","FA",0,13],
  ["Kareem Hunt","RB","FA",0,13],
  // --- WR ---
  ["Jalen Tolbert","WR","MIA",6,13],
  ["Konata Mumpfield","WR","LAR",11,13],
  // --- TE ---
  ["Max Klare","TE","LAR",11,13],
  // --- WR ---
  ["Calvin Austin III","WR","NYG",8,13],
  // --- QB ---
  ["J.J. McCarthy","QB","MIN",6,13],
  // --- WR ---
  ["Jahan Dotson","WR","ATL",11,13],
  // --- TE ---
  ["Tyler Higbee","TE","LAR",11,13],
  ["Elijah Arroyo","TE","SEA",11,13],
  // --- WR ---
  ["Jalen Royals","WR","KC",5,13],
  // --- TE ---
  ["Cole Kmet","TE","CHI",10,13],
  ["Ja'Tavion Sanders","TE","CAR",5,13],
  ["Michael Mayer","TE","LV",13,13],
  // --- WR ---
  ["DeMario Douglas","WR","NE",11,13],
  // --- TE ---
  ["Dawson Knox","TE","BUF",7,13],
  ["Noah Gray","TE","KC",5,13],
  // --- WR ---
  ["Olamide Zaccheaus","WR","ATL",11,13],
  ["Treylon Burks","WR","WAS",7,13],
  ["Joshua Palmer","WR","BUF",7,13],
  // --- QB ---
  ["Carson Beck","QB","ARI",14,13],
  // --- RB ---
  ["Bam Knight","RB","ARI",14,14],
  // --- DST ---
  ["Carolina Panthers","DST","CAR",5,14],
  ["Dallas Cowboys","DST","DAL",14,14],
  // --- QB ---
  ["Mac Jones","QB","SF",8,14],
  // --- WR ---
  ["Bryce Lance","WR","NO",8,14],
  // --- RB ---
  ["Michael Carter","RB","TEN",9,14],
  // --- WR ---
  ["Kendrick Bourne","WR","ARI",14,14],
  ["Brenen Thompson","WR","LAC",7,14],
  // --- RB ---
  ["Eli Heidenreich","RB","PIT",9,14],
  // --- K ---
  ["Jake Elliott","K","PHI",10,14],
  // --- TE ---
  ["Erick All Jr.","TE","CIN",6,14],
  ["Justin Joly","TE","DEN",10,14],
  ["Eli Raridon","TE","NE",11,14],
  // --- WR ---
  ["Dont'e Thornton Jr.","WR","LV",13,14],
  // --- QB ---
  ["Justin Fields","QB","KC",5,14],
  // --- WR ---
  ["Xavier Hutchinson","WR","HOU",8,14],
  // --- DST ---
  ["New York Giants","DST","NYG",8,14],
  // --- RB ---
  ["J'Mari Taylor","RB","JAC",7,14],
  // --- WR ---
  ["John Metchie III","WR","CAR",5,14],
  // --- RB ---
  ["Raheim Sanders","RB","CLE",11,14],
  // --- QB ---
  ["Ty Simpson","QB","LAR",11,14],
  // --- RB ---
  ["Jawhar Jordan","RB","HOU",8,14],
  // --- TE ---
  ["Noah Fant","TE","NO",8,14],
  // --- RB ---
  ["Nick Chubb","RB","FA",0,14],
  // --- WR ---
  ["Jaylin Lane","WR","WAS",7,14],
  ["KaVontae Turpin","WR","DAL",14,14],
  // --- DST ---
  ["Tampa Bay Buccaneers","DST","TB",10,14],
  // --- WR ---
  ["Tutu Atwell","WR","MIA",6,14],
  ["Kevin Coleman Jr.","WR","MIA",6,14],
  // --- TE ---
  ["Luke Musgrave","TE","GB",11,14],
  // --- K ---
  ["Nick Folk","K","ATL",11,14],
  // --- DST ---
  ["Tennessee Titans","DST","TEN",9,14],
  // --- WR ---
  ["Savion Williams","WR","GB",11,14],
  ["Kalif Raymond","WR","CHI",10,14],
  // --- K ---
  ["Tyler Bass","K","BUF",7,14],
  // --- QB ---
  ["Anthony Richardson Sr.","QB","IND",13,14],
  // --- K ---
  ["Zane Gonzalez","K","MIA",6,14],
  // --- WR ---
  ["Nick Westbrook-Ikhine","WR","IND",13,14],
  // --- K ---
  ["Ryan Fitzgerald","K","CAR",5,14],
  // --- RB ---
  ["Dameon Pierce","RB","PHI",10,14],
  // --- K ---
  ["Trey Smack","K","GB",11,14],
  // --- RB ---
  ["Austin Ekeler","RB","FA",0,14],
  // --- DST ---
  ["Washington Commanders","DST","WAS",7,14],
  // --- TE ---
  ["Tommy Tremble","TE","CAR",5,14],
  // --- WR ---
  ["Zavion Thomas","WR","CHI",10,14],
  // --- RB ---
  ["Phil Mafah","RB","DAL",14,14],
  // --- K ---
  ["Blake Grupe","K","IND",13,14],
  // --- TE ---
  ["Ben Sinnott","TE","WAS",7,14],
  // --- DST ---
  ["Miami Dolphins","DST","MIA",6,14],
  // --- K ---
  ["Ben Sauls","K","NYG",8,14],
  // --- RB ---
  ["Kyle Juszczyk","RB","SF",8,14],
  ["Rasheen Ali","RB","BAL",13,14],
  ["Jam Miller","RB","NE",11,14],
  // --- WR ---
  ["Jordan Whittington","WR","LAR",11,14],
  // --- TE ---
  ["John Bates","TE","WAS",7,14],
  // --- WR ---
  ["Dyami Brown","WR","WAS",7,14],
  // --- RB ---
  ["Terrell Jennings","RB","NE",11,14],
  // --- K ---
  ["Joey Slye","K","TEN",9,14],
  // --- WR ---
  ["Devontez Walker","WR","BAL",13,14],
  // --- QB ---
  ["Joe Flacco","QB","CIN",6,14],
  // --- K ---
  ["Chad Ryland","K","ARI",14,14],
  // --- RB ---
  ["Roschon Johnson","RB","CHI",10,14],
  // --- WR ---
  ["Deion Burks","WR","IND",13,14],
  // --- K ---
  ["Brandon McManus","K","FA",0,14],
  // --- TE ---
  ["Charlie Kolar","TE","LAC",7,14],
  // --- WR ---
  ["Ashton Dulin","WR","IND",13,14],
  // --- RB ---
  ["Sione Vaki","RB","DET",6,14],
  // --- DST ---
  ["Cincinnati Bengals","DST","CIN",6,14],
  // --- TE ---
  ["Mitchell Evans","TE","CAR",5,14],
  ["Daniel Bellinger","TE","TEN",9,14],
  ["Zach Ertz","TE","FA",0,14],
  // --- RB ---
  ["Jeremy McNichols","RB","WAS",7,15],
  // --- K ---
  ["Daniel Carlson","K","LV",13,15],
  // --- TE ---
  ["Darren Waller","TE","FA",0,15],
  // --- WR ---
  ["CJ Daniels","WR","LAR",11,15],
  // --- QB ---
  ["Marcus Mariota","QB","WAS",7,15],
  // --- TE ---
  ["Tommy Myers","TE","FA",0,15],
  // --- RB ---
  ["Jaret Patterson","RB","LAC",7,15],
  // --- WR ---
  ["Greg Dortch","WR","DET",6,15],
  // --- TE ---
  ["Austin Hooper","TE","ATL",11,15],
  // --- K ---
  ["Jake Moody","K","WAS",7,15],
  // --- QB ---
  ["Cade Klubnik","QB","NYJ",13,15],
  ["Joe Milton III","QB","DAL",14,15],
  // --- TE ---
  ["Marlin Klein","TE","HOU",8,15],
  // --- RB ---
  ["Dylan Laube","RB","LV",13,15],
  // --- TE ---
  ["Jonnu Smith","TE","FA",0,15],
  // --- WR ---
  ["Malik Benson","WR","LV",13,15],
  // --- RB ---
  ["Damien Martinez","RB","GB",11,15],
  // --- WR ---
  ["Mitch Tinsley","WR","CIN",6,15],
  ["Demarcus Robinson","WR","SF",8,15],
  // --- RB ---
  ["Robert Henry Jr.","RB","WAS",7,15],
  // --- DST ---
  ["Las Vegas Raiders","DST","LV",13,15],
  // --- QB ---
  ["Jameis Winston","QB","NYG",8,15],
  // --- WR ---
  ["Tyler Lockett","WR","LV",13,15],
  ["Roman Wilson","WR","PIT",9,15],
  // --- RB ---
  ["Antonio Gibson","RB","FA",0,15],
  // --- WR ---
  ["Marquez Valdes-Scantling","WR","DAL",14,15],
  // --- RB ---
  ["Frank Gore Jr.","RB","BUF",7,15],
  ["Khalil Herbert","RB","SF",8,15],
  ["Ty Chandler","RB","NO",8,15],
  // --- TE ---
  ["Josh Oliver","TE","MIN",6,15],
  // --- RB ---
  ["Roman Hemby","RB","LV",13,15],
  // --- TE ---
  ["Nate Boerkircher","TE","JAC",7,15],
  // --- RB ---
  ["Donovan Edwards","RB","MIA",6,15],
  // --- WR ---
  ["Colbie Young","WR","CIN",6,15],
  // --- TE ---
  ["Taysom Hill","TE","FA",0,15],
  ["Will Kacmarek","TE","MIA",6,15],
  // --- RB ---
  ["Cash Jones","RB","ATL",11,15],
  // --- K ---
  ["Spencer Shrader","K","IND",13,15],
  // --- TE ---
  ["Adam Trautman","TE","DEN",10,15],
  // --- WR ---
  ["Jakobie Keeney-James","WR","PIT",9,15],
  // --- RB ---
  ["Zavier Scott","RB","MIN",6,15],
  // --- WR ---
  ["Scotty Miller","WR","CHI",10,15],
  // --- RB ---
  ["Hunter Luepke","RB","DAL",14,15],
  // --- WR ---
  ["Kendric Pryor","WR","CIN",6,15],
  ["Jahdae Walker","WR","CHI",10,15],
  // --- TE ---
  ["Tanner Koziol","TE","JAC",7,15],
  // --- RB ---
  ["Jacob Saylors","RB","DET",6,15],
  // --- WR ---
  ["Kevin Austin Jr.","WR","NO",8,15],
  // --- RB ---
  ["Myles Montgomery","RB","NE",11,15],
  ["AJ Dillon","RB","CAR",5,15],
  // --- TE ---
  ["Mo Alie-Cox","TE","IND",13,15],
  // --- WR ---
  ["Odell Beckham Jr.","WR","NYG",8,15],
  ["Jake Bobo","WR","SEA",11,15],
  ["Tim Patrick","WR","NYJ",13,15],
  // --- RB ---
  ["Jaydn Ott","RB","KC",5,15],
  ["Tyler Goodson","RB","ATL",11,15],
  ["Miles Sanders","RB","FA",0,15],
  // --- WR ---
  ["Jeshaun Jones","WR","MIN",6,15],
  // --- RB ---
  ["Elijah Tau-Tolliver","RB","BAL",13,15],
  ["Ameer Abdullah","RB","JAC",7,15],
  ["Jacardia Wright","RB","SEA",11,15],
  // --- WR ---
  ["Xavier Restrepo","WR","TEN",9,15],
  ["Xavier Smith","WR","LAR",11,15],
  // --- TE ---
  ["Luke Schoonmaker","TE","DAL",14,15],
  // --- WR ---
  ["Tai Felton","WR","MIN",6,15],
  ["Theo Wease Jr.","WR","MIA",6,15],
  // --- RB ---
  ["Elijah Mitchell","RB","PHI",10,15],
  // --- WR ---
  ["Elijah Moore","WR","PHI",10,15],
  // --- RB ---
  ["Dean Connors","RB","LAR",11,15],
  // --- TE ---
  ["Elijah Higgins","TE","ARI",14,15],
  // --- QB ---
  ["Riley Leonard","QB","IND",13,15],
  // --- RB ---
  ["Ronnie Rivers","RB","LAR",11,15],
  // --- TE ---
  ["Jackson Hawes","TE","BUF",7,15],
  // --- RB ---
  ["Pierre Strong Jr.","RB","GB",11,16],
  // --- WR ---
  ["Jordan Watkins","WR","SF",8,16],
  // --- TE ---
  ["Drew Sample","TE","CIN",6,16],
  ["Brock Wright","TE","DET",6,16],
  // --- QB ---
  ["Gardner Minshew II","QB","ARI",14,16],
  // --- WR ---
  ["Reggie Virgil","WR","ARI",14,16],
  // --- TE ---
  ["Tanner Hudson","TE","CIN",6,16],
  // --- QB ---
  ["Quinn Ewers","QB","MIA",6,16],
  ["Trey Lance","QB","LAC",7,16],
];
