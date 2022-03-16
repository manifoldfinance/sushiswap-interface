/**
* Sushi Dashboard
*/

import Container from "app/components/Container";
import { TitleAndMetaTags } from "app/constants/TitleAndMetaTags";
import Head from "next/head";


export default function Dashboard() {
  return (
    <Container id="dashboard-page" className="py-4 md:py-8 lg:py-12" maxWidth="2xl">
      <Head>
      <TitleAndMetaTags title="Sushiswap" />
      </Head>
    </Container>
  )
}
/** @exports Dashboard */
