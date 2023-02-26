import './style.css'

const roomNums = [
  "N309",
  "N310",
  "Main_Atrium",
  "N311",
  "N318",
  "N317",
  "N318a",
  "N319",
  "N320",
  "N325",
  "N328",
  "N331",
  "N334",
  "N336",
  "N329",
  "N332",
  "N339",
  "N340",
  "N341",
  "N346",
  "N345",
  "N344",
];

/*
const roomNums = [
  //"N303",
  //"N303a",
  "Reception",
  "N309",
  "N310",
  "N311",
  "N317",
  "N318",
  "N318a",
  "N346",
  "N345",
  "N344",
  "N319",
  "N320",
  "N325",
  "N328",
  "N328a",
  "N328b",
  "N327",
  "N329",
  "N332",
  "N331",
  "N334",
  "N336",
  "N340",
  "N339",
  "N341",
  "N342",
  "NS323",
  "NS324",
  "NS325",
  "NS326S"
]
*/

roomNums.forEach((roomNum) => {
  console.log(roomNum);
  document
    .getElementById(roomNum)
    .addEventListener("click", () => showDescription(roomNum));
});

function showDescription(roomNum) {
  console.log(roomNum + " clicked");
  document.getElementById("roomNumber").innerText = roomNum;
}



