import type { NextPage } from 'next';
import Scan from '../src/components/Scan';

const Home: NextPage = () => {
  return (
    <>
      <Scan scanName='Navigating_Retirement'/>
    </>
  )
}

export default Home;
