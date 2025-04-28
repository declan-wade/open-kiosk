import { Router } from 'express';
import { login, getCustomerDateTime, listClasses, listWorkoutComponents, reserveClass } from '../wodify/api';

async function handleLogin(req: any, res: any) {
  const response = await login(req.body.email, req.body.password);
  res.send(response);
}

async function handleClasses(req: any, res: any) {  
    try {
      const session = await login(req.body.email, req.body.password)
      //console.log(session)
      const dateTime = await getCustomerDateTime(session)
      //console.log(dateTime)
      const classes = await listClasses(session, req.body.date)
      //console.log(classes)
      res.send(classes)
    } catch (e: any) {
      console.log('Error:', e.message)
      res.error(e.message)
    }
  }

async function handleWorkouts(req: any, res: any) {
    try {
      const session = await login(req.body.email, req.body.password)
      const programId = session.User.GymProgramId === '20714' ? '109084' : session.User.GymProgramId
      let workout = await listWorkoutComponents(session, req.body.date, programId)
      res.send(workout)
    } catch (e: any) {
      console.log('Error:', e.message)
      res.error(e.message)
    }
  }

  async function handleReservation(req: any, res: any) {
    try {
      const session = await login(req.body.email, req.body.password)
      let response = await reserveClass(session, req.body.classId)
      res.send(response)
    } catch (e: any) {
      console.log('Error:', e.message)
      res.error(e.message)
    }
  }

async function cancelReservation(req: any, res: any) {
    try {
      const session = await login(req.body.email, req.body.password)
      const dateTime = await getCustomerDateTime(session)
      //console.log(dateTime)
      const classes = await cancelReservation(session, req.body.reservationId)
      //console.log(classes)
      res.send(classes)
    } catch (e: any) {
      console.log('Error:', e.message)
      res.error(e.message)
    }
  }

const router = Router();

router.post('/login', handleLogin);
router.post('/getClasses', handleClasses);
router.post('/getWorkouts', handleWorkouts);
router.post('/cancelReservation', cancelReservation);
router.post('/reserve', handleReservation);


export default router;