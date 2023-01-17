import { Padding } from '@mui/icons-material';
import Box from '@mui/material/Box'
import { padding } from '@mui/system';
import personalPic from "./personalPic.jpg"
import githubSVG from "./github.svg"
import linkedinSVG from "./linkedin.svg"
function Menu() {
  return (
    <div >
      <div>
      <img style = {{ borderRadius : 400/2 , width : 300, height : 300, marginLeft : 350 }} src={personalPic}  />
      </div>
      <br></br>
      <Box style={{fontFamily: 'Courier New'}} sx={{position: 'absolute', left: '250px', fontSize: 'h12.fontSize'}}>
        <br></br>
      I am Zyad Youssef, a recent Computer Engineering graduate from the University Of Utah. Although my undergrad studies were both  Hardware and Software oriented, I am much more interested in Software than I am in Hardware. I am currently employed with Goldman Sachs as a New Software Engineering Analyst.   
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <div>

        SOCIALS
        </div>
      </Box>

      <div>



        
      <a href="https://github.com/zyad-youssef" target="_blank" rel="noreferrer">
        <img style = {{   position: 'absolute',
        bottom: 0,
        right: 1,
        left: 1,
        borderRadius : 400/2 , width : 100, height : 100, marginLeft : 700 }} src={githubSVG} alt="git"></img>
      </a>


      <a href="https://github.com/zyad-youssef" target="_blank" rel="noreferrer">
        <img style = {{   position: 'absolute',
        bottom: 0,
         width : 90, height : 90, marginLeft : 120 }} src={linkedinSVG} alt="linkedin"></img>
      </a>


      </div>






  </div>
  );
}

export default Menu;
