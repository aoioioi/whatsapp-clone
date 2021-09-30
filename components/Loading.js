import Head from 'next/head';
// import { Circle } from 'better-react-spinkit';


function Loading() {
  return (
    <center style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
      <Head>
        <title>Loading...</title>
      </Head>
      <div>
        <img
          src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Ficons.iconarchive.com%2Ficons%2Fdtafalonso%2Fandroid-l%2F512%2FWhatsApp-icon.png&f=1&nofb=1"
          alt=""
          style={{ marginBottom: '10px' }}
          height={200}
        />
        <h3>Loading...</h3>
        {/* <Circle color="#3CBC28" size={60} /> */}
      </div>
    </center>
  )
}

export default Loading
