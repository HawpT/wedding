import * as express from 'express';
import { readdirSync } from 'fs';
import path from 'path';
import { staticDir } from '../server';

//Models

const staticFilesRoute = express.Router();
export default staticFilesRoute;

const imageFileExtensions = ['jpg', 'jpeg', 'png'];
const memories     = 'memories'    ;
const formals      = 'formals'     ;
const gettingready = 'gettingready';
const ceremony     = 'ceremony'    ;
const family       = 'family'      ;
const reception    = 'reception'   ;
const honeymoon    = 'honeymoon'   ;

function sortByImageNumber(a: string, b: string): number {
  const imageNumberRegex = /(?:[^0-9]*)([0-9]+)(?:\.[a-z0-9]+)/i;
  const aMatch = a.match(imageNumberRegex);
  const bMatch = b.match(imageNumberRegex);
  let aInt = 0;
  let bInt = 0;
  if ((!aMatch || aMatch.length === 0) && (!bMatch || bMatch.length === 0)) {
    return a.localeCompare(b);
  }
  if (!aMatch || aMatch.length === 0) 
    return -1;
  if (!bMatch || bMatch.length === 0) 
    return 1;
  if (aMatch.length > 1) {
    aInt = Number.parseInt(aMatch[1]);
  }
  if (bMatch.length > 1) {
    bInt = Number.parseInt(bMatch[1]);
  }
  return aInt - bInt;
}

staticFilesRoute.route(['/', '/list', `/${memories}`]).get((req, res, next) => {
  try {
    let files = readdirSync(path.join(staticDir, memories), { withFileTypes: true});
    files = files.filter(f => f.isFile() && imageFileExtensions.includes(f.name.substring(f.name.lastIndexOf('.') + 1).toLowerCase()));
    const fileNames = files.map(f => f.name).sort(sortByImageNumber);
    res.json({ 'fileNames': fileNames });
  } catch(error) {
    return next(error);
  }
});

staticFilesRoute.route([`/${formals}`]).get((req, res, next) => {
  try {
    let files = readdirSync(path.join(staticDir, formals), { withFileTypes: true});
    files = files.filter(f => f.isFile() && imageFileExtensions.includes(f.name.substring(f.name.lastIndexOf('.') + 1).toLowerCase()));
    const fileNames = files.map(f => f.name).sort(sortByImageNumber);
    res.json({ 'fileNames': fileNames });
  } catch(error) {
    return next(error);
  }
});

staticFilesRoute.route([`/${gettingready}`]).get((req, res, next) => {
  try {
    let files = readdirSync(path.join(staticDir, gettingready), { withFileTypes: true});
    files = files.filter(f => f.isFile() && imageFileExtensions.includes(f.name.substring(f.name.lastIndexOf('.') + 1).toLowerCase()));
    const fileNames = files.map(f => f.name).sort(sortByImageNumber);
    res.json({ 'fileNames': fileNames });
  } catch(error) {
    return next(error);
  }
});

staticFilesRoute.route([`/${ceremony}`]).get((req, res, next) => {
  try {
    let files = readdirSync(path.join(staticDir, ceremony), { withFileTypes: true});
    files = files.filter(f => f.isFile() && imageFileExtensions.includes(f.name.substring(f.name.lastIndexOf('.') + 1).toLowerCase()));
    const fileNames = files.map(f => f.name).sort(sortByImageNumber);
    res.json({ 'fileNames': fileNames });
  } catch(error) {
    return next(error);
  }
});

staticFilesRoute.route([`/${family}`]).get((req, res, next) => {
  try {
    let files = readdirSync(path.join(staticDir, family), { withFileTypes: true});
    files = files.filter(f => f.isFile() && imageFileExtensions.includes(f.name.substring(f.name.lastIndexOf('.') + 1).toLowerCase()));
    const fileNames = files.map(f => f.name).sort(sortByImageNumber);
    res.json({ 'fileNames': fileNames });
  } catch(error) {
    return next(error);
  }
});

staticFilesRoute.route([`/${reception}`]).get((req, res, next) => {
  try {
    let files = readdirSync(path.join(staticDir, reception), { withFileTypes: true});
    files = files.filter(f => f.isFile() && imageFileExtensions.includes(f.name.substring(f.name.lastIndexOf('.') + 1).toLowerCase()));
    const fileNames = files.map(f => f.name).sort(sortByImageNumber);
    res.json({ 'fileNames': fileNames });
  } catch(error) {
    return next(error);
  }
});

staticFilesRoute.route([`/${honeymoon}`]).get((req, res, next) => {
  try {
    let files = readdirSync(path.join(staticDir, honeymoon), { withFileTypes: true});
    files = files.filter(f => f.isFile() && imageFileExtensions.includes(f.name.substring(f.name.lastIndexOf('.') + 1).toLowerCase()));
    const fileNames = files.map(f => f.name).sort(sortByImageNumber);
    res.json({ 'fileNames': fileNames });
  } catch(error) {
    return next(error);
  }
});