import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import { Random } from "random-js";

const random = new Random();
const path = "./ada.json";


const encryptDate = (dateStr) => {

  const key = Array.from({length: dateStr.length}, () => 
    Math.floor(Math.random() * 256)
  );
  
  const encrypted = dateStr.split('').map((char, i) => {
    const charCode = char.charCodeAt(0);
    const keyByte = key[i % key.length];
    return (charCode ^ keyByte) + keyByte; 
  });


  return encrypted
    .map(num => Math.abs(num).toString(36))
    .join('')
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, 32); 
};

const markCommit = (n) => {
  if (n === 0) return simpleGit().push();

  const now = moment();
  const oneYearAgo = moment().subtract(1, "y");
  const randomDate = moment(random.date(oneYearAgo.toDate(), now.toDate()));
  
  const data = {
    date: encryptDate(randomDate.format()),
  };

  console.log(randomDate.format()); 
  jsonfile.writeFile(path, data, () => {
    simpleGit()
      .add([path])
      .commit(randomDate.format(), { "--date": randomDate.format() }, markCommit.bind(this, --n));
  });
};

markCommit(100);
