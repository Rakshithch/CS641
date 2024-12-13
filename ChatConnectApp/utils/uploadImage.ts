// import { Platform } from "react-native";
// import * as FileSystem from "expo-file-system";
// import { ref, uploadBytes, uploadString, getDownloadURL } from "firebase/storage";

// interface UploadImageProps {
//   imageUri: string;
//   storage: any;
//   userId: string;
// }

// const uploadImage = async ({
//   imageUri,
//   storage,
//   userId,
// }: UploadImageProps): Promise<string> => {
//   try {
//     const imagePath = `chatMedia/${userId}/${Date.now()}.jpg`;
//     const storageRef = ref(storage, imagePath);

//     if (Platform.OS === "web") {
//       const response = await fetch(imageUri);
//       const blob = await response.blob();
//       await uploadBytes(storageRef, blob, { contentType: "image/jpeg" });
//     } else {
//       const base64 = await FileSystem.readAsStringAsync(imageUri, {
//         encoding: FileSystem.EncodingType.Base64,
//       });
//       await uploadString(storageRef, base64, "base64", { contentType: "image/jpeg" });
//     }

//     const downloadURL = await getDownloadURL(storageRef);
//     return downloadURL;
//   } catch (error) {
//     console.error("Error uploading image:", error);
//     throw new Error("Failed to upload image");
//   }
// };

// export default uploadImage;

import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import { ref, uploadBytes, uploadString, getDownloadURL } from "firebase/storage";

interface UploadImageProps {
  imageUri: string;
  storage: any;
  userId: string;
  fileType: string; 
}

const uploadImage = async ({
  imageUri,
  storage,
  userId,
  fileType,
}: UploadImageProps): Promise<string> => {
  try {
    const fileExtension = fileType === "video" ? "mp4" : "jpg";
    const contentType = fileType === "video" ? "video/mp4" : "image/jpeg";

    const filePath = `chatMedia/${userId}/${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, filePath);

    if (Platform.OS === "web") {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob, { contentType });
    } else {
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      await uploadString(storageRef, base64, "base64", { contentType });
    }

    const downloadURL = await getDownloadURL(storageRef);
    console.log("Uploaded media URL:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading media:", error);
    throw new Error("Failed to upload media");
  }
};

export default uploadImage;
