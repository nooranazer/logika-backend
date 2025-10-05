import multer from "multer";
import path from "path";
import fs from "fs";

const baseUploadPath = path.join(process.cwd(), "uploads");

if (!fs.existsSync(baseUploadPath)) {
  fs.mkdirSync(baseUploadPath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let subfolder = "others";

    if (file.fieldname === "image") subfolder = "images";
    else if (file.fieldname === "userManual") subfolder = "manuals";
    else if (file.fieldname === "technicalDataSheet") subfolder = "datasheets";
    else if (file.fieldname === "areaOfApplyFiles") subfolder = "applyFiles"; // ✅ fixed

    const finalPath = path.join(baseUploadPath, subfolder);
    if (!fs.existsSync(finalPath)) {
      fs.mkdirSync(finalPath, { recursive: true });
    }

    cb(null, finalPath);
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueName + path.extname(file.originalname)
    );
  },
});

const fileFilter = (field) => (req, file, cb) => {
  if (field === "image" || field === "areaOfApplyFiles") {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"), false);
  } else {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only PDF/DOC/DOCX files are allowed"), false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, 
});

export const uploadFields = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "userManual", maxCount: 1 },
  { name: "technicalDataSheet", maxCount: 1 },
  { name: "areaOfApplyFiles", maxCount: 10 }, 
]);
