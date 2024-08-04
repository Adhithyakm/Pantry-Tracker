'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField,InputAdornment ,Grid} from '@mui/material'
import { firestore } from '../app/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,} from 'firebase/firestore'
import { getAnalytics, isSupported } from 'firebase/analytics'
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 3,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  const [pantry, setPantry] = useState([])
  const [filteredPantry, setFilteredPantry] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [highlightedItem, setHighlightedItem] = useState('')

  // We'll add our component logic here

  const updatePantry = async () => {
  const snapshot = query(collection(firestore, 'pantry'))
  const docs = await getDocs(snapshot)
  const pantryList = []
  docs.forEach((doc) => {
    pantryList.push({ name: doc.id, ...doc.data() })
  })
    setFilteredPantry(pantryList) 
    setPantry(pantryList)
  }

  const addItem = async (item) => {
  const docRef = doc(collection(firestore, 'pantry'), item)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    const { quantity } = docSnap.data()
    await setDoc(docRef, { quantity: quantity + 1 })
  } else {
    await setDoc(docRef, { quantity: 1 })
  }
  await updatePantry()
}

const removeItem = async (item) => {
  const docRef = doc(collection(firestore, 'pantry'), item)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    const { quantity } = docSnap.data()
    if (quantity === 1) {
      await deleteDoc(docRef)
    } else {
      await setDoc(docRef, { quantity: quantity - 1 })
    }
  }
  await updatePantry()
}
  
  useEffect(() => {
  updatePantry();
  }, []);
  
  useEffect(() => {
    // Filter pantry items based on search term
    setFilteredPantry(
      pantry.filter(({ name }) =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [searchTerm, pantry])

const handleOpen = () => setOpen(true)
const handleClose = () => setOpen(false)
  
const handleSearch = () => {
    // Highlight the item if found
    const itemToHighlight = pantry.find(({ name }) =>
      name.toLowerCase() === searchTerm.toLowerCase()
    )
    if (itemToHighlight) {
      setHighlightedItem(itemToHighlight.name)
    } else {
      setHighlightedItem('') // Clear highlight if not found
    }
  }


  
  return (
    <Box
      
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      flexDirection={'column'}
      
    >
    
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Stack spacing={3} alignItems="center" width="800px">
        <Stack direction="row" spacing={2} alignItems="center"></Stack>
      
       <TextField
          id="search-input"
          label="Search Items"
          variant="outlined"
        
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button variant="contained" sx={{ color: 'white', bgcolor: '#03045e', '&:hover': { bgcolor: 'darkgreen' } ,marginBottom: 0 }}  onClick={handleOpen} marginBottom='1'>
        Add New Item
      </Button>
              </InputAdornment>
            ),
          }}
          sx={{ width: '300px' ,marginBottom: '3', height:'60px', border:'#003554'}}
        />
        </Stack>
      <Box >
        <Box
          width="800px"
          height="100px"
          bgcolor={'#0077b6'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          border={'1px solid #caf0f8'}
        >
          <Typography variant={'h3'} color={'#ffffff'} textAlign={'center'}  >
            Pantry Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow={'auto'} >
          {filteredPantry.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              Height="80px"
              display={'flex'}
              
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#00b4d8'}
              //paddingX={2}
              borderRadius={1}
              //marginBottom={2}
              
            >
            
              <Typography variant={'h5'} color={'#333'} textAlign={'center'}  >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
             
            
              
                <Typography variant={'h5'} color={'#333'} textAlign={'center'}  >
                 Quantity:{quantity}
               
                </Typography>
             
              
                <Button variant="contained" sx={{ color: 'white', bgcolor: '#03045e', '&:hover': { bgcolor: 'darkred' } }} onClick={() => removeItem(name)} >
                Remove
                </Button>
              
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

      
  






