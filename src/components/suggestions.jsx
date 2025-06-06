import { useContext } from "react";
import TokenContext from "../contexts/TokenContext";

export default function suggestionsUsers(){
    const {token, setToken} = useContext(TokenContext);
    
    const auth = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

}