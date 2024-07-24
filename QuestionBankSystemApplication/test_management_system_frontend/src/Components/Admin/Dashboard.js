import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

function Dashboard(){
return(
    <>
     <div style={{ display: 'flex' }}>
      <Card sx={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.3)' ,width: 300, minWidth: 200, flex: '1 1 auto', marginRight: 2 ,backgroundColor: '#b0bacd',marginTop:18,height:250,'&:hover': { color:'white',backgroundColor: 'darkblue'} }}>
        <CardContent>
          <Typography variant="h6" component="div"sx={{  fontFamily: 'Arial, sans-serif',textAlign: 'center', paddingTop:10,fontWeight: 'bold' }}>
            <Link to='/getallusers' style={{  textDecoration: 'none' }}>All User Details</Link>
          </Typography>
        </CardContent>
      </Card>
      <Card sx={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.3)' ,width: 300,minWidth: 200, flex: '1 1 auto', marginRight: 2 ,backgroundColor: '#efb165',marginTop:18,height:250,'&:hover': { backgroundColor: 'darkred', color:'white'} }}>        <CardContent>
          <Typography variant="h6" component="div" sx={{  fontFamily: 'Arial, sans-serif',textAlign: 'center', paddingTop:10,fontWeight: 'bold' }}>
            <Link to='/topic' style={{  textDecoration: 'none' }}>Topics</Link>
          </Typography>
         
        </CardContent>
      </Card>
      <Card sx={{boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.3)' ,width: 300, minWidth: 200, flex: '1 1 auto', marginRight: 2 ,backgroundColor: '#b0bacd',marginTop:18,height:250,'&:hover': { backgroundColor: 'darkgreen',color:'white' } }}>        <CardContent>
          <Typography variant="h6" component="div" sx={{  fontFamily: 'Arial, sans-serif',textAlign: 'center', paddingTop:10 ,fontWeight: 'bold'}}>
           <Link to='/questionbank' style={{  textDecoration: 'none' }}> Question Bank</Link>
          </Typography>
        </CardContent>
      </Card>
    </div>
   
    </>
);
}
export default Dashboard;