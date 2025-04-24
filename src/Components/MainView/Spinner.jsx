import './Spinner.css'

export default function Spinner({color}){
    return(
        <div style={{width:'100%',height:'90vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <div className="loader" style={{borderTop: `10px solid #${color}`}}></div>
        </div>
    )
}