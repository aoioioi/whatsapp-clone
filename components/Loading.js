import Head from 'next/head';

function Loading() {
  return (
    <center style={{ display: 'grid', placeItems: 'center', height: '100vh', background: '#2e2e2e' }}>
      <Head>
        <title>Loading...</title>
      </Head>
      <div>
        <img
          src="https://icons.iconarchive.com/icons/dtafalonso/android-l/512/WhatsApp-icon.png"
          alt=""
          style={{ marginBottom: '10px' }}
          height={200}
        />
        <h3 style={{ color: 'gainsboro', fontWeight: 'normal' }}>Loading...</h3>
      </div>
    </center>
  )
}

export default Loading
