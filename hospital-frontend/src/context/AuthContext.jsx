useEffect(() => {
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const data = await getCurrentUser();

      // SAFE CHECK (IMPORTANT FIX)
      if (data && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log("Auth Error:", error.message);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null); // 🔥 IMPORTANT FIX
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, []);