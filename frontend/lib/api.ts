"use server"

export async function getClasses(date: string) {
    try {
      const response = await fetch(`${process.env.API_BACKEND}/api/getClasses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "email": process.env.WODIFY_USERNAME,
          "password": process.env.WODIFY_PASSWORD,
          "date": date
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) { 
      console.error("Failed to fetch workout data:", error);
      return null;
    }
  }
  
  export async function getWorkouts(date: string) {
    try {
      const response = await fetch(`${process.env.API_BACKEND}/api/getWorkouts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "email": process.env.WODIFY_USERNAME,
          "password": process.env.WODIFY_PASSWORD,
          "date": date
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) { 
      console.error("Failed to fetch workout data:", error);
      return null;
    }
  }

  export async function cancelReservation(reservationId: string) {
    try {
      const response = await fetch(`${process.env.API_BACKEND}/api/cancelReservation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "email": process.env.WODIFY_USERNAME,
          "password": process.env.WODIFY_PASSWORD,
          "reservationId": reservationId
        }),
      })
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) { 
    console.error("Failed to fetch workout data:", error);
    return null;
  }
}

export async function makeReservation(classId: string) {
  try {
    const response = await fetch(`${process.env.API_BACKEND}/api/reserve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "email": process.env.WODIFY_USERNAME,
        "password": process.env.WODIFY_PASSWORD,
        "classId": classId
      }),
    })
  
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  const data = await response.json();
  return data;
} catch (error) { 
  console.error("Failed to fetch workout data:", error);
  return null;
}
}