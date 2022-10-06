
   require("./Ex4.js");

   var attributes  =  "Deborah; 21; 21 + 0.5; 0.5 - 25" ;

   var pieces = attributes.split(";");

   for (i=0; i<pieces.length;i++) {
    errorArray = isNotNegativeInterger(pieces[i], true);
     console.log(`i: ${i} ${errorArray.join(", ")}`);
    }