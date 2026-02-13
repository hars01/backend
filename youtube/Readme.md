 => bcrypt vs brypt.js -> ye hamare password ko hash me badalne ka kaam karta hai



=> JWT -> ek token banata hai jo cryptography ke kaam me aata hai like secret base 64 encoded
      -> ye bearer token hota hai thik chabhi ki tarah 
      -> jo eshko bear karta hai ushko hum sahi man lete hai hai jaise ki jo bhi n=hume ye bhejega ushko hum data bhej denge

# FILE HANDELING
   -> npm i cloudinary multer (package to install)

   -> hum user se file upload karayenge toh hum ushe 1. multer ka use karke user se file ko lenge aur local me temporary state me rakh denge 2. Phir hum cloudinary ka use karte hue ush localstorage se file lenge aur ushe server me dal denge 

   -> multer ka use hum file hadeling ke liye karte hai jaha pe ye localstorage <=> cloudinary database me file ko deta aur leta hai



# Access Token Vs Refresh Token
        Access token ka use kar ke hum login karayenge 