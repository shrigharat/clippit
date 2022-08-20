import firebase from "firebase/compat/app";

export default interface IClip {
  docID? : string;
  uid: string;
  url: string;
  screenshotURL: string;
  screenshotFileName: string;
  fileName: string;
  displayName: string;
  title: string;
  timestamp: firebase.firestore.FieldValue;
}
