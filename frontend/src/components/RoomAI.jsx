const RoomAI = () => {
    const [image, setImage] = useState(null);
    const [result, setResult] = useState(null);
  
    const handleUpload = async (file) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result.split(",")[1];
  
        const response = await axios.post(
          "/api/ai/recommend-room",
          { image: base64 }
        );
  
        setResult(response.data);
      };
      reader.readAsDataURL(file);
    };
  
    return (
      <>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleUpload(e.target.files[0])}
        />
  
        {result && (
          <div>
            <h3>Room Type: {result.analysis.roomType}</h3>
            <h3>Wall Color: {result.analysis.wallColor}</h3>
  
            {result.recommendations.map(p => (
              <div key={p._id}>
                <img src={p.image[0]} width="150" />
                <p>{p.name}</p>
              </div>
            ))}
          </div>
        )}
      </>
    );
  };
  