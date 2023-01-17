import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

function Menu() {
  return (
    <Box>
	<Typography variant="h5" style={{fontFamily: 'Courier New'}} sx={{position: 'absolute', left: '730px'}}>
	  U-DASH
	  <div> this is a test</div>
	  <div> </div>
	  Crypto Tracker
	</Typography>
    </Box>
  );
}

export default Menu;
