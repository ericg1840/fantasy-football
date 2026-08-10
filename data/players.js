/* Seed player data for the fantasy football draft/season tracker.
   Source: FantasyPros consensus 2026 draft rankings (overall cheat sheet),
   PDF export dated 8/9/26. Ranks/tiers/byes reflect that snapshot and will
   drift as the preseason progresses (trades, depth-chart news, injuries).
   adpDelta is FantasyPros' "ECR vs. ADP" figure: positive means experts rank
   the player better than where they're actually being drafted (a value),
   negative means the market is drafting them earlier than experts rate them
   (a likely reach). null means no ADP data was available for that player.
   Re-import an updated export any time via the Import/Export tab. */

const SEED_DATA_DATE = "2026-08-09";

const SEED_PLAYERS = [
  // --- RB ---
  ["Jahmyr Gibbs","RB","DET",6,1,0],
  ["Bijan Robinson","RB","ATL",11,1,0],
  // --- WR ---
  ["Ja'Marr Chase","WR","CIN",6,1,0],
  ["Puka Nacua","WR","LAR",11,1,2],
  ["Jaxon Smith-Njigba","WR","SEA",11,2,3],
  ["Amon-Ra St. Brown","WR","DET",6,2,6],
  // --- RB ---
  ["Jonathan Taylor","RB","IND",13,2,-2],
  ["Christian McCaffrey","RB","SF",8,2,-4],
  // --- WR ---
  ["CeeDee Lamb","WR","DAL",14,2,6],
  // --- RB ---
  ["James Cook III","RB","BUF",7,2,-3],
  // --- WR ---
  ["Justin Jefferson","WR","MIN",6,2,5],
  // --- RB ---
  ["Derrick Henry","RB","BAL",13,3,1],
  // --- WR ---
  ["Nico Collins","WR","HOU",8,3,14],
  ["A.J. Brown","WR","NE",11,3,14],
  ["Drake London","WR","ATL",11,3,4],
  // --- RB ---
  ["Saquon Barkley","RB","PHI",10,3,-2],
  // --- TE ---
  ["Brock Bowers","TE","LV",13,3,8],
  // --- WR ---
  ["George Pickens","WR","DAL",14,3,8],
  // --- RB ---
  ["Ashton Jeanty","RB","LV",13,3,-10],
  ["Omarion Hampton","RB","LAC",7,3,-9],
  // --- TE ---
  ["Trey McBride","TE","ARI",14,4,0],
  // --- QB ---
  ["Josh Allen","QB","BUF",7,4,-4],
  // --- RB ---
  ["Kenneth Walker III","RB","KC",5,4,-3],
  ["Chase Brown","RB","CIN",6,4,-7],
  ["De'Von Achane","RB","MIA",6,4,-15],
  // --- WR ---
  ["Rashee Rice","WR","KC",5,4,7],
  ["Chris Olave","WR","NO",8,4,2],
  // --- QB ---
  ["Lamar Jackson","QB","BAL",13,4,6],
  // --- RB ---
  ["Kyren Williams","RB","LAR",11,4,-6],
  // --- WR ---
  ["Zay Flowers","WR","BAL",13,4,13],
  ["Tee Higgins","WR","CIN",6,4,11],
  ["DeVonta Smith","WR","PHI",10,4,14],
  ["Malik Nabers","WR","NYG",8,4,-1],
  // --- QB ---
  ["Drake Maye","QB","NE",11,4,21],
  // --- RB ---
  ["Josh Jacobs","RB","GB",11,4,-11],
  // --- WR ---
  ["Emeka Egbuka","WR","TB",10,4,9],
  ["Tetairoa McMillan","WR","CAR",5,4,2],
  // --- RB ---
  ["Javonte Williams","RB","DAL",14,5,-7],
  // --- TE ---
  ["Colston Loveland","TE","CHI",10,5,10],
  // --- RB ---
  ["Breece Hall","RB","NYJ",13,5,-10],
  ["Jeremiyah Love","RB","ARI",14,5,-19],
  // --- QB ---
  ["Joe Burrow","QB","CIN",6,5,18],
  // --- WR ---
  ["Davante Adams","WR","LAR",11,5,13],
  ["Ladd McConkey","WR","LAC",7,5,4],
  ["Jameson Williams","WR","DET",6,5,12],
  ["Terry McLaurin","WR","WAS",7,5,12],
  ["Jaylen Waddle","WR","DEN",10,5,4],
  ["Christian Watson","WR","GB",11,5,19],
  // --- RB ---
  ["Travis Etienne Jr.","RB","NO",8,5,-14],
  // --- QB ---
  ["Jayden Daniels","QB","WAS",7,5,14],
  // --- WR ---
  ["Garrett Wilson","WR","NYJ",13,6,-11],
  // --- RB ---
  ["Cam Skattebo","RB","NYG",8,6,-15],
  // --- WR ---
  ["Mike Evans","WR","SF",8,6,9],
  // --- RB ---
  ["Quinshon Judkins","RB","CLE",11,6,-13],
  // --- WR ---
  ["Luther Burden III","WR","CHI",10,6,-17],
  // --- RB ---
  ["D'Andre Swift","RB","CHI",10,6,-3],
  // --- WR ---
  ["Rome Odunze","WR","CHI",10,6,9],
  // --- QB ---
  ["Jalen Hurts","QB","PHI",10,6,11],
  // --- RB ---
  ["Bucky Irving","RB","TB",10,6,-23],
  ["David Montgomery","RB","HOU",8,6,-10],
  // --- TE ---
  ["Tucker Kraft","TE","GB",11,6,13],
  // --- RB ---
  ["TreVeyon Henderson","RB","NE",11,6,-18],
  // --- WR ---
  ["DJ Moore","WR","BUF",7,6,-11],
  // --- RB ---
  ["Bhayshul Tuten","RB","JAC",7,6,-17],
  // --- TE ---
  ["Tyler Warren","TE","IND",13,6,-6],
  // --- RB ---
  ["Jadarian Price","RB","SEA",11,6,13],
  // --- QB ---
  ["Caleb Williams","QB","CHI",10,6,19],
  ["Justin Herbert","QB","LAC",7,6,22],
  // --- WR ---
  ["Marvin Harrison Jr.","WR","ARI",14,7,14],
  ["Brian Thomas Jr.","WR","JAC",7,7,5],
  ["Carnell Tate","WR","TEN",9,7,0],
  // --- RB ---
  ["Jaylen Warren","RB","PIT",9,7,-11],
  ["Tony Pollard","RB","TEN",9,7,-3],
  // --- WR ---
  ["Alec Pierce","WR","IND",13,7,23],
  // --- QB ---
  ["Trevor Lawrence","QB","JAC",7,7,13],
  // --- WR ---
  ["DK Metcalf","WR","PIT",9,7,6],
  // --- TE ---
  ["Sam LaPorta","TE","DET",6,7,10],
  // --- QB ---
  ["Dak Prescott","QB","DAL",14,7,13],
  // --- RB ---
  ["Rhamondre Stevenson","RB","NE",11,7,-14],
  // --- WR ---
  ["Parker Washington","WR","JAC",7,7,4],
  // --- RB ---
  ["Chuba Hubbard","RB","CAR",5,7,-4],
  ["Rico Dowdle","RB","PIT",9,7,-14],
  // --- WR ---
  ["Courtland Sutton","WR","DEN",10,7,-5],
  // --- RB ---
  ["J.K. Dobbins","RB","DEN",10,7,-4],
  // --- TE ---
  ["Harold Fannin Jr.","TE","CLE",11,7,-22],
  ["Kyle Pitts Sr.","TE","ATL",11,7,-10],
  // --- RB ---
  ["Blake Corum","RB","LAR",11,7,-6],
  // --- WR ---
  ["Quentin Johnston","WR","LAC",7,7,26],
  // --- QB ---
  ["Jaxson Dart","QB","NYG",8,7,3],
  // --- RB ---
  ["Kyle Monangai","RB","CHI",10,7,-18],
  // --- QB ---
  ["Brock Purdy","QB","SF",8,7,20],
  // --- WR ---
  ["Jordyn Tyson","WR","NO",8,7,-7],
  ["Chris Godwin Jr.","WR","TB",10,7,-4],
  ["Jordan Addison","WR","MIN",6,8,13],
  // --- RB ---
  ["RJ Harvey","RB","DEN",10,8,-41],
  // --- TE ---
  ["George Kittle","TE","SF",8,8,13],
  // --- QB ---
  ["Bo Nix","QB","DEN",10,8,23],
  // --- WR ---
  ["Michael Wilson","WR","ARI",14,8,-25],
  // --- QB ---
  ["Patrick Mahomes II","QB","KC",5,8,7],
  // --- RB ---
  ["Jacory Croskey-Merritt","RB","WAS",7,8,-1],
  // --- QB ---
  ["Matthew Stafford","QB","LAR",11,8,17],
  // --- TE ---
  ["Dalton Kincaid","TE","BUF",7,8,-4],
  // --- WR ---
  ["Makai Lemon","WR","PHI",10,8,-7],
  ["Jayden Reed","WR","GB",11,8,18],
  // --- TE ---
  ["Travis Kelce","TE","KC",5,8,-3],
  // --- QB ---
  ["Jared Goff","QB","DET",6,8,19],
  // --- RB ---
  ["Jordan Mason","RB","MIN",6,8,-4],
  ["Rachaad White","RB","WAS",7,8,9],
  ["Jonathon Brooks","RB","CAR",5,8,15],
  // --- WR ---
  ["Michael Pittman Jr.","WR","PIT",9,8,-6],
  // --- RB ---
  ["Aaron Jones Sr.","RB","MIN",6,8,-11],
  ["Kenny Gainwell","RB","TB",10,8,-17],
  // --- TE ---
  ["Mark Andrews","TE","BAL",13,8,-5],
  ["Dallas Goedert","TE","PHI",10,8,2],
  // --- QB ---
  ["Kyler Murray","QB","MIN",6,8,40],
  // --- WR ---
  ["Jakobi Meyers","WR","JAC",7,8,-22],
  ["Xavier Worthy","WR","KC",5,8,13],
  // --- TE ---
  ["Isaiah Likely","TE","NYG",8,8,-17],
  // --- QB ---
  ["Baker Mayfield","QB","TB",10,8,23],
  // --- WR ---
  ["Josh Downs","WR","IND",13,8,8],
  // --- QB ---
  ["Jordan Love","QB","GB",11,8,18],
  // --- WR ---
  ["Wan'Dale Robinson","WR","TEN",9,8,-29],
  // --- RB ---
  ["Chris Rodriguez Jr.","RB","JAC",7,8,26],
  // --- QB ---
  ["Tyler Shough","QB","NO",8,8,23],
  // --- WR ---
  ["Jayden Higgins","WR","HOU",8,8,18],
  // --- TE ---
  ["Jake Ferguson","TE","DAL",14,8,-21],
  // --- WR ---
  ["Romeo Doubs","WR","NE",11,8,-1],
  // --- RB ---
  ["Tyrone Tracy Jr.","RB","NYG",8,9,-7],
  ["Tyler Allgeier","RB","ARI",14,9,-19],
  ["Woody Marks","RB","HOU",8,9,-17],
  ["Zach Charbonnet","RB","SEA",11,9,-19],
  // --- WR ---
  ["Jalen Coker","WR","CAR",5,9,12],
  ["Matthew Golden","WR","GB",11,9,32],
  // --- QB ---
  ["Malik Willis","QB","MIA",6,9,18],
  // --- WR ---
  ["Rashid Shaheed","WR","SEA",11,9,28],
  ["Khalil Shakir","WR","BUF",7,9,0],
  ["KC Concepcion","WR","CLE",11,9,1],
  // --- QB ---
  ["Sam Darnold","QB","SEA",11,9,32],
  // --- RB ---
  ["Isiah Pacheco","RB","DET",6,9,17],
  ["Tank Bigsby","RB","PHI",10,9,26],
  // --- QB ---
  ["C.J. Stroud","QB","HOU",8,9,32],
  // --- RB ---
  ["Brian Robinson Jr.","RB","ATL",11,9,-27],
  ["Alvin Kamara","RB","NO",8,9,-16],
  ["Keaton Mitchell","RB","LAC",7,9,10],
  // --- TE ---
  ["Brenton Strange","TE","JAC",7,9,-11],
  ["Hunter Henry","TE","NE",11,9,-23],
  ["Juwan Johnson","TE","NO",8,9,-28],
  // --- RB ---
  ["Tyjae Spears","RB","TEN",9,9,-15],
  // --- TE ---
  ["Oronde Gadsden II","TE","LAC",7,9,-18],
  // --- WR ---
  ["Deebo Samuel Sr.","WR","SF",8,9,8],
  // --- RB ---
  ["Dylan Sampson","RB","CLE",11,9,0],
  // --- WR ---
  ["Jauan Jennings","WR","MIN",6,9,1],
  // --- QB ---
  ["Cam Ward","QB","TEN",9,9,38],
  ["Daniel Jones","QB","IND",13,9,46],
  // --- RB ---
  ["Jonah Coleman","RB","DEN",10,9,-20],
  // --- TE ---
  ["Chig Okonkwo","TE","WAS",7,9,-10],
  // --- DST ---
  ["Houston Texans","DST","HOU",8,9,-20],
  // --- WR ---
  ["Jerry Jeudy","WR","CLE",11,9,14],
  ["Stefon Diggs","WR","WAS",7,9,-27],
  ["Adonai Mitchell","WR","NYJ",13,9,37],
  // --- RB ---
  ["Braelon Allen","RB","NYJ",13,9,7],
  // --- WR ---
  ["Jalen McMillan","WR","TB",10,10,18],
  ["Denzel Boston","WR","CLE",11,10,11],
  ["Omar Cooper Jr.","WR","NYJ",13,10,7],
  ["Travis Hunter","WR","JAC",7,10,23],
  ["Tre Tucker","WR","LV",13,10,45],
  // --- QB ---
  ["Bryce Young","QB","CAR",5,10,36],
  // --- DST ---
  ["Denver Broncos","DST","DEN",10,10,-7],
  ["Seattle Seahawks","DST","SEA",11,10,-21],
  ["Los Angeles Rams","DST","LAR",11,10,-30],
  // --- WR ---
  ["Kayshon Boutte","WR","NE",11,10,4],
  ["Tre' Harris","WR","LAC",7,10,42],
  // --- DST ---
  ["Philadelphia Eagles","DST","PHI",10,10,-9],
  // --- RB ---
  ["Kimani Vidal","RB","LAC",7,10,9],
  // --- WR ---
  ["De'Zhaun Stribling","WR","SF",8,10,30],
  // --- RB ---
  ["Emanuel Wilson","RB","SEA",11,10,48],
  // --- TE ---
  ["AJ Barner","TE","SEA",11,10,2],
  // --- WR ---
  ["Ryan Flournoy","WR","DAL",14,10,67],
  // --- RB ---
  ["Emmett Johnson","RB","KC",5,10,-19],
  ["Ray Davis","RB","BUF",7,10,32],
  // --- WR ---
  ["Calvin Ridley","WR","TEN",9,10,1],
  // --- TE ---
  ["Kenyon Sadiq","TE","NYJ",13,10,-41],
  // --- RB ---
  ["Sean Tucker","RB","TB",10,10,1],
  // --- K ---
  ["Brandon Aubrey","K","DAL",14,10,-55],
  // --- DST ---
  ["Minnesota Vikings","DST","MIN",6,10,0],
  // --- WR ---
  ["Jalen Nailor","WR","LV",13,10,4],
  // --- TE ---
  ["Dalton Schultz","TE","HOU",8,10,-42],
  // --- DST ---
  ["Jacksonville Jaguars","DST","JAC",7,10,14],
  // --- RB ---
  ["James Conner","RB","ARI",14,10,-32],
  // --- DST ---
  ["New England Patriots","DST","NE",11,10,-12],
  ["Pittsburgh Steelers","DST","PIT",9,10,25],
  // --- RB ---
  ["Mike Washington Jr.","RB","LV",13,10,-23],
  // --- TE ---
  ["Terrance Ferguson","TE","LAR",11,10,-1],
  // --- DST ---
  ["Los Angeles Chargers","DST","LAC",7,10,35],
  // --- K ---
  ["Ka'imi Fairbairn","K","HOU",8,10,-18],
  // --- QB ---
  ["Jacoby Brissett","QB","ARI",14,10,13],
  // --- RB ---
  ["Nicholas Singleton","RB","TEN",9,10,-8],
  // --- K ---
  ["Cameron Dicker","K","LAC",7,10,-36],
  // --- WR ---
  ["Rashod Bateman","WR","BAL",13,10,96],
  ["Isaac TeSlaa","WR","DET",6,10,20],
  ["Troy Franklin","WR","DEN",10,10,52],
  ["Dontayvion Wicks","WR","PHI",10,10,73],
  // --- K ---
  ["Cam Little","K","JAC",7,11,-27],
  // --- DST ---
  ["Baltimore Ravens","DST","BAL",13,11,-5],
  // --- RB ---
  ["Kaytron Allen","RB","WAS",7,11,-7],
  // --- WR ---
  ["Darnell Mooney","WR","NYG",8,11,38],
  // --- K ---
  ["Jason Myers","K","SEA",11,11,-40],
  // --- WR ---
  ["Jaylin Noel","WR","HOU",8,11,74],
  // --- RB ---
  ["MarShawn Lloyd","RB","GB",11,11,28],
  // --- TE ---
  ["T.J. Hockenson","TE","MIN",6,11,-60],
  // --- DST ---
  ["Green Bay Packers","DST","GB",11,11,28],
  // --- K ---
  ["Eddy Pineiro","K","SF",8,11,14],
  ["Tyler Loop","K","BAL",13,11,-26],
  // --- WR ---
  ["Antonio Williams","WR","WAS",7,11,-13],
  ["Malik Washington","WR","MIA",6,11,18],
  ["Pat Bryant","WR","DEN",10,11,44],
  // --- RB ---
  ["Jaylen Wright","RB","MIA",6,11,4],
  // --- WR ---
  ["Tank Dell","WR","HOU",8,11,-14],
  // --- DST ---
  ["Kansas City Chiefs","DST","KC",5,11,38],
  // --- RB ---
  ["Jaydon Blue","RB","DAL",14,11,-10],
  ["Ollie Gordon II","RB","MIA",6,11,112],
  // --- TE ---
  ["Gunnar Helm","TE","TEN",9,11,-41],
  ["Pat Freiermuth","TE","PIT",9,11,32],
  // --- DST ---
  ["Detroit Lions","DST","DET",6,11,10],
  // --- K ---
  ["Evan McPherson","K","CIN",6,11,62],
  ["Cairo Santos","K","CHI",10,11,37],
  // --- DST ---
  ["Cleveland Browns","DST","CLE",11,11,73],
  // --- K ---
  ["Andy Borregales","K","NE",11,11,-15],
  ["Jake Bates","K","DET",6,11,-21],
  // --- WR ---
  ["Cooper Kupp","WR","SEA",11,11,35],
  // --- QB ---
  ["Aaron Rodgers","QB","PIT",9,11,-1],
  // --- WR ---
  ["Zachariah Branch","WR","ATL",11,11,-13],
  // --- QB ---
  ["Geno Smith","QB","NYJ",13,11,2],
  // --- TE ---
  ["David Njoku","TE","LAC",7,11,-75],
  // --- WR ---
  ["Chimere Dike","WR","TEN",9,11,26],
  // --- DST ---
  ["Buffalo Bills","DST","BUF",7,11,31],
  // --- TE ---
  ["Cade Otton","TE","TB",10,11,-51],
  // --- K ---
  ["Chase McLaughlin","K","TB",10,11,20],
  // --- WR ---
  ["Elic Ayomanor","WR","TEN",9,11,35],
  ["Keon Coleman","WR","BUF",7,11,59],
  // --- K ---
  ["Harrison Mevis","K","LAR",11,11,-47],
  // --- TE ---
  ["Greg Dulcich","TE","MIA",6,11,1],
  // --- WR ---
  ["Germie Bernard","WR","PIT",9,11,29],
  // --- RB ---
  ["Demond Claiborne","RB","MIN",6,11,-27],
  // --- K ---
  ["Chris Boswell","K","PIT",9,11,-30],
  // --- TE ---
  ["Colby Parkinson","TE","LAR",11,11,-50],
  // --- K ---
  ["Harrison Butker","K","KC",5,11,-29],
  // --- RB ---
  ["George Holani","RB","SEA",11,11,-1],
  // --- TE ---
  ["Evan Engram","TE","DEN",10,12,40],
  // --- WR ---
  ["Tory Horton","WR","SEA",11,12,26],
  // --- RB ---
  ["Jordan James","RB","SF",8,12,18],
  ["Malik Davis","RB","DAL",14,12,null],
  ["Justice Hill","RB","BAL",13,12,-22],
  // --- WR ---
  ["Jack Bech","WR","LV",13,12,47],
  // --- RB ---
  ["Isaiah Davis","RB","NYJ",13,12,86],
  // --- TE ---
  ["Eli Stowers","TE","PHI",10,12,-61],
  // --- RB ---
  ["Devin Neal","RB","NO",8,12,-3],
  // --- WR ---
  ["Elijah Sarratt","WR","BAL",13,12,34],
  ["Tyquan Thornton","WR","KC",5,12,77],
  // --- RB ---
  ["Kaelon Black","RB","SF",8,12,-8],
  // --- QB ---
  ["Fernando Mendoza","QB","LV",13,12,-55],
  // --- RB ---
  ["Trey Benson","RB","ARI",14,12,-55],
  ["Ty Johnson","RB","BUF",7,12,-12],
  // --- WR ---
  ["Ted Hurst III","WR","TB",10,12,14],
  // --- RB ---
  ["DJ Giddens","RB","IND",13,12,70],
  ["Chris Brooks","RB","GB",11,12,71],
  // --- TE ---
  ["Theo Johnson","TE","NYG",8,12,-40],
  // --- QB ---
  ["Tua Tagovailoa","QB","ATL",11,12,-32],
  // --- WR ---
  ["Christian Kirk","WR","SF",8,12,10],
  // --- K ---
  ["Wil Lutz","K","DEN",10,12,-29],
  // --- WR ---
  ["Chris Bell","WR","MIA",6,12,23],
  ["Malachi Fields","WR","NYG",8,12,-44],
  ["Darius Slayton","WR","NYG",8,12,null],
  ["Brandon Aiyuk","WR","SF",8,12,-42],
  // --- TE ---
  ["Mason Taylor","TE","NYJ",13,12,-53],
  // --- RB ---
  ["Samaje Perine","RB","CIN",6,12,26],
  // --- WR ---
  ["Marvin Mims Jr.","WR","DEN",10,12,8],
  // --- K ---
  ["Will Reichard","K","MIN",6,12,-40],
  // --- WR ---
  ["Xavier Legette","WR","CAR",5,12,18],
  // --- DST ---
  ["San Francisco 49ers","DST","SF",8,12,-3],
  // --- RB ---
  ["Kaleb Johnson","RB","PIT",9,12,-22],
  // --- DST ---
  ["Atlanta Falcons","DST","ATL",11,12,28],
  // --- WR ---
  ["Devaughn Vele","WR","NO",8,12,13],
  // --- RB ---
  ["Kendre Miller","RB","NO",8,12,-16],
  ["Emari Demercado","RB","KC",5,12,55],
  // --- TE ---
  ["Oscar Delp","TE","NO",8,12,null],
  // --- RB ---
  ["Devin Singletary","RB","NYG",8,12,-4],
  // --- QB ---
  ["Michael Penix Jr.","QB","ATL",11,12,-48],
  // --- WR ---
  ["Hollywood Brown","WR","PHI",10,12,2],
  ["Kyle Williams","WR","NE",11,12,-2],
  ["Ja'Kobi Lane","WR","BAL",13,12,-68],
  // --- TE ---
  ["Mike Gesicki","TE","CIN",6,12,11],
  // --- RB ---
  ["Adam Randall","RB","BAL",13,12,46],
  // --- QB ---
  ["Kirk Cousins","QB","LV",13,12,-45],
  // --- WR ---
  ["Keenan Allen","WR","LAC",7,12,-9],
  ["Tyreek Hill","WR","FA",0,12,-103],
  // --- QB ---
  ["Deshaun Watson","QB","CLE",11,12,-33],
  ["Shedeur Sanders","QB","CLE",11,12,-56],
  // --- WR ---
  ["Mack Hollins","WR","NE",11,12,null],
  // --- RB ---
  ["LeQuint Allen Jr.","RB","JAC",7,12,-10],
  ["Jerome Ford","RB","WAS",7,12,24],
  ["Seth McGowan","RB","IND",13,12,40],
  // --- WR ---
  ["Skyler Bell","WR","BUF",7,12,25],
  // --- DST ---
  ["New Orleans Saints","DST","NO",8,12,15],
  // --- RB ---
  ["Brashard Smith","RB","KC",5,12,-35],
  ["Najee Harris","RB","LAC",7,12,-50],
  // --- WR ---
  ["Isaiah Bond","WR","CLE",11,13,null],
  // --- TE ---
  ["Jake Tonges","TE","SF",8,13,-83],
  // --- RB ---
  ["Isaac Guerendo","RB","SF",8,13,null],
  ["Trevor Etienne","RB","CAR",5,13,null],
  // --- K ---
  ["Charlie Smyth","K","NO",8,13,13],
  // --- DST ---
  ["Indianapolis Colts","DST","IND",13,13,-5],
  // --- RB ---
  ["Tahj Brooks","RB","CIN",6,13,null],
  // --- WR ---
  ["Andrei Iosivas","WR","CIN",6,13,-10],
  // --- DST ---
  ["Chicago Bears","DST","CHI",10,13,-49],
  // --- TE ---
  ["Darnell Washington","TE","PIT",9,13,-7],
  // --- RB ---
  ["Jarquez Hunter","RB","LAR",11,13,-33],
  ["Jaleel McLaughlin","RB","DEN",10,13,null],
  // --- WR ---
  ["Caleb Douglas","WR","MIA",6,13,-6],
  ["Cyrus Allen","WR","KC",5,13,-27],
  ["Chris Brazzell II","WR","CAR",5,13,null],
  // --- RB ---
  ["Audric Estime","RB","NO",8,13,-42],
  // --- WR ---
  ["Luke McCaffrey","WR","WAS",7,13,null],
  ["Cedric Tillman","WR","CLE",11,13,null],
  // --- RB ---
  ["Will Shipley","RB","PHI",10,13,null],
  // --- WR ---
  ["Tez Johnson","WR","TB",10,13,null],
  // --- RB ---
  ["Joe Mixon","RB","FA",0,13,-81],
  ["Kareem Hunt","RB","FA",0,13,-30],
  // --- WR ---
  ["Jalen Tolbert","WR","MIA",6,13,-58],
  ["Konata Mumpfield","WR","LAR",11,13,null],
  // --- TE ---
  ["Max Klare","TE","LAR",11,13,-26],
  // --- WR ---
  ["Calvin Austin III","WR","NYG",8,13,null],
  // --- QB ---
  ["J.J. McCarthy","QB","MIN",6,13,-71],
  // --- WR ---
  ["Jahan Dotson","WR","ATL",11,13,-11],
  // --- TE ---
  ["Tyler Higbee","TE","LAR",11,13,null],
  ["Elijah Arroyo","TE","SEA",11,13,null],
  // --- WR ---
  ["Jalen Royals","WR","KC",5,13,null],
  // --- TE ---
  ["Cole Kmet","TE","CHI",10,13,null],
  ["Ja'Tavion Sanders","TE","CAR",5,13,null],
  ["Michael Mayer","TE","LV",13,13,-23],
  // --- WR ---
  ["DeMario Douglas","WR","NE",11,13,null],
  // --- TE ---
  ["Dawson Knox","TE","BUF",7,13,null],
  ["Noah Gray","TE","KC",5,13,null],
  // --- WR ---
  ["Olamide Zaccheaus","WR","ATL",11,13,null],
  ["Treylon Burks","WR","WAS",7,13,null],
  ["Joshua Palmer","WR","BUF",7,13,null],
  // --- QB ---
  ["Carson Beck","QB","ARI",14,13,-74],
  // --- RB ---
  ["Bam Knight","RB","ARI",14,14,null],
  // --- DST ---
  ["Carolina Panthers","DST","CAR",5,14,-35],
  ["Dallas Cowboys","DST","DAL",14,14,-102],
  // --- QB ---
  ["Mac Jones","QB","SF",8,14,null],
  // --- WR ---
  ["Bryce Lance","WR","NO",8,14,null],
  // --- RB ---
  ["Michael Carter","RB","TEN",9,14,null],
  // --- WR ---
  ["Kendrick Bourne","WR","ARI",14,14,null],
  ["Brenen Thompson","WR","LAC",7,14,-26],
  // --- RB ---
  ["Eli Heidenreich","RB","PIT",9,14,null],
  // --- K ---
  ["Jake Elliott","K","PHI",10,14,-45],
  // --- TE ---
  ["Erick All Jr.","TE","CIN",6,14,null],
  ["Justin Joly","TE","DEN",10,14,null],
  ["Eli Raridon","TE","NE",11,14,-22],
  // --- WR ---
  ["Dont'e Thornton Jr.","WR","LV",13,14,null],
  // --- QB ---
  ["Justin Fields","QB","KC",5,14,null],
  // --- WR ---
  ["Xavier Hutchinson","WR","HOU",8,14,null],
  // --- DST ---
  ["New York Giants","DST","NYG",8,14,-114],
  // --- RB ---
  ["J'Mari Taylor","RB","JAC",7,14,null],
  // --- WR ---
  ["John Metchie III","WR","CAR",5,14,null],
  // --- RB ---
  ["Raheim Sanders","RB","CLE",11,14,null],
  // --- QB ---
  ["Ty Simpson","QB","LAR",11,14,-42],
  // --- RB ---
  ["Jawhar Jordan","RB","HOU",8,14,null],
  // --- TE ---
  ["Noah Fant","TE","NO",8,14,null],
  // --- RB ---
  ["Nick Chubb","RB","FA",0,14,null],
  // --- WR ---
  ["Jaylin Lane","WR","WAS",7,14,null],
  ["KaVontae Turpin","WR","DAL",14,14,null],
  // --- DST ---
  ["Tampa Bay Buccaneers","DST","TB",10,14,-63],
  // --- WR ---
  ["Tutu Atwell","WR","MIA",6,14,-60],
  ["Kevin Coleman Jr.","WR","MIA",6,14,null],
  // --- TE ---
  ["Luke Musgrave","TE","GB",11,14,null],
  // --- K ---
  ["Nick Folk","K","ATL",11,14,-51],
  // --- DST ---
  ["Tennessee Titans","DST","TEN",9,14,-57],
  // --- WR ---
  ["Savion Williams","WR","GB",11,14,null],
  ["Kalif Raymond","WR","CHI",10,14,null],
  // --- K ---
  ["Tyler Bass","K","BUF",7,14,-74],
  // --- QB ---
  ["Anthony Richardson Sr.","QB","IND",13,14,null],
  // --- K ---
  ["Zane Gonzalez","K","MIA",6,14,null],
  // --- WR ---
  ["Nick Westbrook-Ikhine","WR","IND",13,14,null],
  // --- K ---
  ["Ryan Fitzgerald","K","CAR",5,14,null],
  // --- RB ---
  ["Dameon Pierce","RB","PHI",10,14,null],
  // --- K ---
  ["Trey Smack","K","GB",11,14,null],
  // --- RB ---
  ["Austin Ekeler","RB","FA",0,14,-108],
  // --- DST ---
  ["Washington Commanders","DST","WAS",7,14,null],
  // --- TE ---
  ["Tommy Tremble","TE","CAR",5,14,null],
  // --- WR ---
  ["Zavion Thomas","WR","CHI",10,14,null],
  // --- RB ---
  ["Phil Mafah","RB","DAL",14,14,null],
  // --- K ---
  ["Blake Grupe","K","IND",13,14,null],
  // --- TE ---
  ["Ben Sinnott","TE","WAS",7,14,null],
  // --- DST ---
  ["Miami Dolphins","DST","MIA",6,14,-62],
  // --- K ---
  ["Ben Sauls","K","NYG",8,14,null],
  // --- RB ---
  ["Kyle Juszczyk","RB","SF",8,14,null],
  ["Rasheen Ali","RB","BAL",13,14,null],
  ["Jam Miller","RB","NE",11,14,null],
  // --- WR ---
  ["Jordan Whittington","WR","LAR",11,14,null],
  // --- TE ---
  ["John Bates","TE","WAS",7,14,null],
  // --- WR ---
  ["Dyami Brown","WR","WAS",7,14,null],
  // --- RB ---
  ["Terrell Jennings","RB","NE",11,14,null],
  // --- K ---
  ["Joey Slye","K","TEN",9,14,null],
  // --- WR ---
  ["Devontez Walker","WR","BAL",13,14,null],
  // --- QB ---
  ["Joe Flacco","QB","CIN",6,14,null],
  // --- K ---
  ["Chad Ryland","K","ARI",14,14,null],
  // --- RB ---
  ["Roschon Johnson","RB","CHI",10,14,null],
  // --- WR ---
  ["Deion Burks","WR","IND",13,14,null],
  // --- K ---
  ["Brandon McManus","K","FA",0,14,null],
  // --- TE ---
  ["Charlie Kolar","TE","LAC",7,14,null],
  // --- WR ---
  ["Ashton Dulin","WR","IND",13,14,null],
  // --- RB ---
  ["Sione Vaki","RB","DET",6,14,null],
  // --- DST ---
  ["Cincinnati Bengals","DST","CIN",6,14,-99],
  // --- TE ---
  ["Mitchell Evans","TE","CAR",5,14,null],
  ["Daniel Bellinger","TE","TEN",9,14,null],
  ["Zach Ertz","TE","FA",0,14,null],
  // --- RB ---
  ["Jeremy McNichols","RB","WAS",7,15,null],
  // --- K ---
  ["Daniel Carlson","K","LV",13,15,null],
  // --- TE ---
  ["Darren Waller","TE","FA",0,15,null],
  // --- WR ---
  ["CJ Daniels","WR","LAR",11,15,null],
  // --- QB ---
  ["Marcus Mariota","QB","WAS",7,15,null],
  // --- TE ---
  ["Tommy Myers","TE","FA",0,15,null],
  // --- RB ---
  ["Jaret Patterson","RB","LAC",7,15,null],
  // --- WR ---
  ["Greg Dortch","WR","DET",6,15,null],
  // --- TE ---
  ["Austin Hooper","TE","ATL",11,15,null],
  // --- K ---
  ["Jake Moody","K","WAS",7,15,null],
  // --- QB ---
  ["Cade Klubnik","QB","NYJ",13,15,null],
  ["Joe Milton III","QB","DAL",14,15,null],
  // --- TE ---
  ["Marlin Klein","TE","HOU",8,15,null],
  // --- RB ---
  ["Dylan Laube","RB","LV",13,15,null],
  // --- TE ---
  ["Jonnu Smith","TE","FA",0,15,null],
  // --- WR ---
  ["Malik Benson","WR","LV",13,15,null],
  // --- RB ---
  ["Damien Martinez","RB","GB",11,15,null],
  // --- WR ---
  ["Mitch Tinsley","WR","CIN",6,15,null],
  ["Demarcus Robinson","WR","SF",8,15,null],
  // --- RB ---
  ["Robert Henry Jr.","RB","WAS",7,15,null],
  // --- DST ---
  ["Las Vegas Raiders","DST","LV",13,15,-108],
  // --- QB ---
  ["Jameis Winston","QB","NYG",8,15,null],
  // --- WR ---
  ["Tyler Lockett","WR","LV",13,15,null],
  ["Roman Wilson","WR","PIT",9,15,null],
  // --- RB ---
  ["Antonio Gibson","RB","FA",0,15,null],
  // --- WR ---
  ["Marquez Valdes-Scantling","WR","DAL",14,15,null],
  // --- RB ---
  ["Frank Gore Jr.","RB","BUF",7,15,null],
  ["Khalil Herbert","RB","SF",8,15,null],
  ["Ty Chandler","RB","NO",8,15,null],
  // --- TE ---
  ["Josh Oliver","TE","MIN",6,15,null],
  // --- RB ---
  ["Roman Hemby","RB","LV",13,15,null],
  // --- TE ---
  ["Nate Boerkircher","TE","JAC",7,15,null],
  // --- RB ---
  ["Donovan Edwards","RB","MIA",6,15,null],
  // --- WR ---
  ["Colbie Young","WR","CIN",6,15,null],
  // --- TE ---
  ["Taysom Hill","TE","FA",0,15,null],
  ["Will Kacmarek","TE","MIA",6,15,null],
  // --- RB ---
  ["Cash Jones","RB","ATL",11,15,null],
  // --- K ---
  ["Spencer Shrader","K","IND",13,15,null],
  // --- TE ---
  ["Adam Trautman","TE","DEN",10,15,null],
  // --- WR ---
  ["Jakobie Keeney-James","WR","PIT",9,15,null],
  // --- RB ---
  ["Zavier Scott","RB","MIN",6,15,null],
  // --- WR ---
  ["Scotty Miller","WR","CHI",10,15,null],
  // --- RB ---
  ["Hunter Luepke","RB","DAL",14,15,null],
  // --- WR ---
  ["Kendric Pryor","WR","CIN",6,15,null],
  ["Jahdae Walker","WR","CHI",10,15,null],
  // --- TE ---
  ["Tanner Koziol","TE","JAC",7,15,null],
  // --- RB ---
  ["Jacob Saylors","RB","DET",6,15,null],
  // --- WR ---
  ["Kevin Austin Jr.","WR","NO",8,15,null],
  // --- RB ---
  ["Myles Montgomery","RB","NE",11,15,null],
  ["AJ Dillon","RB","CAR",5,15,null],
  // --- TE ---
  ["Mo Alie-Cox","TE","IND",13,15,null],
  // --- WR ---
  ["Odell Beckham Jr.","WR","NYG",8,15,null],
  ["Jake Bobo","WR","SEA",11,15,null],
  ["Tim Patrick","WR","NYJ",13,15,null],
  // --- RB ---
  ["Jaydn Ott","RB","KC",5,15,null],
  ["Tyler Goodson","RB","ATL",11,15,null],
  ["Miles Sanders","RB","FA",0,15,null],
  // --- WR ---
  ["Jeshaun Jones","WR","MIN",6,15,null],
  // --- RB ---
  ["Elijah Tau-Tolliver","RB","BAL",13,15,null],
  ["Ameer Abdullah","RB","JAC",7,15,null],
  ["Jacardia Wright","RB","SEA",11,15,null],
  // --- WR ---
  ["Xavier Restrepo","WR","TEN",9,15,null],
  ["Xavier Smith","WR","LAR",11,15,null],
  // --- TE ---
  ["Luke Schoonmaker","TE","DAL",14,15,null],
  // --- WR ---
  ["Tai Felton","WR","MIN",6,15,null],
  ["Theo Wease Jr.","WR","MIA",6,15,null],
  // --- RB ---
  ["Elijah Mitchell","RB","PHI",10,15,null],
  // --- WR ---
  ["Elijah Moore","WR","PHI",10,15,null],
  // --- RB ---
  ["Dean Connors","RB","LAR",11,15,null],
  // --- TE ---
  ["Elijah Higgins","TE","ARI",14,15,null],
  // --- QB ---
  ["Riley Leonard","QB","IND",13,15,null],
  // --- RB ---
  ["Ronnie Rivers","RB","LAR",11,15,null],
  // --- TE ---
  ["Jackson Hawes","TE","BUF",7,15,null],
  // --- RB ---
  ["Pierre Strong Jr.","RB","GB",11,16,null],
  // --- WR ---
  ["Jordan Watkins","WR","SF",8,16,null],
  // --- TE ---
  ["Drew Sample","TE","CIN",6,16,null],
  ["Brock Wright","TE","DET",6,16,null],
  // --- QB ---
  ["Gardner Minshew II","QB","ARI",14,16,null],
  // --- WR ---
  ["Reggie Virgil","WR","ARI",14,16,null],
  // --- TE ---
  ["Tanner Hudson","TE","CIN",6,16,null],
  // --- QB ---
  ["Quinn Ewers","QB","MIA",6,16,null],
  ["Trey Lance","QB","LAC",7,16,null],
];
