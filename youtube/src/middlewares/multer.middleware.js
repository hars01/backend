// ye ayese kam karta hai application me jaise ki agar user loi bhi kam server se kara raha hao toh woh request direct waha jane se pahle eshase ek bar mil ke jana compulsury hai..
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp'); // ye uploads folder me file ko store karega
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);    
        cb(null, Date.now() + '-' + file.originalname + uniqueSuffix); // ye file ka naam date ke sath store karega
    }
}) // ye memory me file ko store karega

export const upload = multer({ 
    storage
});
