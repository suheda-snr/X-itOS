import { StyleSheet } from 'react-native';
import React from 'react'
import HomeScreenWithScan from '@/components/HomeScreenWithScan';
import Greeting from '@/app/Greeting';
import PersonalQR from './QRScanner/PersonalQR';
import TicketQR from './QRScanner/TicketQR';
import TeamStats from './GameStatistics/TeamStats';

export default function HomeScreen() {
  return (
    <>
      {/*<HomeScreenWithScan />*/}
      {/*<Greeting />*/}
      {/*<PersonalQR />*/}
      {/*<TicketQR />*/}
      <TeamStats />
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
