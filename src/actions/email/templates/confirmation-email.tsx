interface ConfirmationEmailProps {
  name: string;
  respondableEmail?: string;
}

const ConfirmationEmail = ({ name, respondableEmail }: ConfirmationEmailProps) => {
  return (
    <div
      style={{
        backgroundColor: '#f5f5f7',
        padding: '20px',
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        color: '#333333',
        maxWidth: '100%',
        margin: '0',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '30px',
          maxWidth: '550px',
          margin: '0 auto',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        }}
      >
        <h1
          style={{
            fontSize: '22px',
            fontWeight: '600',
            marginTop: '0',
            color: '#333333',
          }}
        >
          Hei {name}
        </h1>

        <p
          style={{
            fontSize: '16px',
            lineHeight: '1.6',
            marginBottom: '24px',
            color: '#333333',
          }}
        >
          Takk for din søknad. Vi setter stor pris på din interesse og vil komme tilbake til deg
          snarest.
        </p>

        <p
          style={{
            fontSize: '16px',
            lineHeight: '1.6',
            marginTop: '30px',
            borderTop: '1px solid #eaeaec',
            paddingTop: '20px',
            color: '#555555',
          }}
        >
          Vennlig hilsen,
          <br />
          Fornavn Etternavn - Bedrift
          {respondableEmail && (
            <>
              <br />
              <a
                href={`mailto:${respondableEmail}`}
                style={{
                  color: '#4a6da7',
                  textDecoration: 'underline',
                  fontWeight: '500',
                  transition: 'color 0.2s',
                }}
              >
                {respondableEmail}
              </a>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default ConfirmationEmail;
