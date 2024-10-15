/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/*.{html,js,ejs}"],
  theme: {
    extend: {
      colors:{
        "white-base":"#F3F3F3",
        "dark":"#242424",
        "primary":"#49A760",
        "secondary":"#F7C35F"
      },
      fontSize:{
        'destop-h1':"60px",
        'destop-h2':"40px",
        'destop-h3':"30px",
        'destop-h4':"20px",
        'destop-p':"18px",

        // mobile font size

        "mobile-h1":"43px",
        "mobile-h2":"36px",
        "mobile-h3":"26px",
        "mobile-h4":"18px",
        "mobile-p":"16px"
      },
      borderRadius:{
        'desktop-form':"15px"
      }
    },
  },
  plugins: [],
}

