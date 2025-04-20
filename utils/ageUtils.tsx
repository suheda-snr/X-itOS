export function isAdult(isoDateString: string) {
    const birthDate = new Date(isoDateString);
    const today = new Date();
  
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
  
    const isBirthdayPassed =
      monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0);
    const realAge = isBirthdayPassed ? age : age - 1;
  
    return realAge >= 18;
  }
  