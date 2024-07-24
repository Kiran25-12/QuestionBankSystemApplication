import React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

export const OwnerDashboard = () => {
  return (

    <>
     <div style={{ display: 'flex' }}>
     
      <Card sx={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.3)' ,width: 100,minWidth: 200, flex: '1 1 auto', marginRight: 5, marginLeft:3 , backgroundColor: '#efb165',marginTop:18,height:250,'&:hover': { backgroundColor: 'darkred', color:'white'} }}>        <CardContent>
          <Typography variant="h6" component="div" sx={{  fontFamily: 'Arial, sans-serif',textAlign: 'center', paddingTop:10,fontWeight: 'bold' }}>
            <Link to='/topic' style={{  textDecoration: 'none' ,fontSize:30}}>Topics Here !!</Link>
          </Typography>
         
        </CardContent>
      </Card>
      <Card sx={{boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.3)' ,width: 100, minWidth: 100, flex: '1 1 auto', marginRight: 2 ,marginLeft:3 , backgroundColor: '#b0bacd',marginTop:18,height:250,'&:hover': { backgroundColor: 'darkgreen',color:'white' } }}>        <CardContent>
          <Typography variant="h6" component="div" sx={{  fontFamily: 'Arial, sans-serif',textAlign: 'center', paddingTop:10 ,fontWeight: 'bold'}}>
           <Link to='/questionbank' style={{  textDecoration: 'none', fontSize:30 }}> Question List Here !!</Link>
          </Typography>
        </CardContent>
      </Card>
    </div>
   
    </>
  )
}
