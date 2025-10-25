import { useRef, useState } from "react";
import { UserContext } from "./UserContext";

// 2. Context Provider
export function UserProvider({ children }) {
  const [searchItem, setSearchItem] = useState("");
  const [cartItemCount, setCartItemCount] = useState(0);
  const [updateArrows, setUpdateArrows] = useState(null); 
  const updateArrowsRef = useRef(null);
  return (
    <UserContext.Provider value={{ searchItem, setSearchItem ,updateArrows, setUpdateArrows,updateArrowsRef,cartItemCount, setCartItemCount}}>
      {children}
    </UserContext.Provider>
  );
}
