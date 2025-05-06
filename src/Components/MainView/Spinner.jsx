import './Spinner.css'

export default function Spinner({color,height}){
    const customHeight = height ? height : '90vh'

    return(
        <div style={{width:'100%',height:customHeight,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <div className="loader" style={{borderTop: `10px solid #${color}`}}></div>
        </div>
    )
}