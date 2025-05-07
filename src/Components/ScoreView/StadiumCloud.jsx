import YankeesDepth from '../../assets/mlb-resources/stadiums/testdepth.png'
import Yankees from '../../assets/mlb-resources/stadiums/test.png'
import RedSoxDepth from '../../assets/mlb-resources/stadiums/fenwaydepth.png'
import RedSox from '../../assets/mlb-resources/stadiums/fenway.jpg'
import DodgersDepth from '../../assets/mlb-resources/stadiums/dodgerdepth.png'
import Dodgers from '../../assets/mlb-resources/stadiums/dodger_stadium.jpg'
import PadresDepth from '../../assets/mlb-resources/stadiums/petcodepth.png'
import Padres from '../../assets/mlb-resources/stadiums/petco_park.jpg'
import GiantsDepth from '../../assets/mlb-resources/stadiums/oracledepth.png'
import Giants from '../../assets/mlb-resources/stadiums/oracle_park.jpg'
import DbacksDepth from '../../assets/mlb-resources/stadiums/chasefielddepth.png'
import Dbacks from '../../assets/mlb-resources/stadiums/chase_field.jpg'


import {useEffect,useMemo,useState,useRef} from 'react'
import { Points,OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

export default function StadiumCloud(){
    return(
        <div>
            <CloudFrame stadiumSrc={Dbacks} depthSrc={DbacksDepth}/>
        </div>
    )
}

function CloudFrame({stadiumSrc,depthSrc}){
    const canvasRef = useRef(null);
    const depthCanvasRef = useRef(null);
    const [imgSize,setImgSize] = useState({width:0,height:0});
    const [stadiumData,setStadiumData] = useState(null);
    const [depthData,setDepthData] = useState(null);
    const [depthSize,setDepthSize] = useState({width:0,height:0});
    const orbitControlRef = useRef(null);


    useEffect(() => {
        const canvas = canvasRef.current;
        const depthCanvas = depthCanvasRef.current;
        const ctx = canvas.getContext('2d');
        const depthCtx = depthCanvas.getContext('2d');

        const loadImages = async () => {
            const img = new Image();
            img.src = stadiumSrc;
            await img.decode();

            const depthImg = new Image();
            depthImg.src = depthSrc;
            await depthImg.decode();

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img,0,0);
            const imageData = ctx.getImageData(0,0,img.width,img.height);
            setStadiumData(imageData.data);
            setImgSize({width:img.width,height:img.height});

            depthCanvas.width = depthImg.width;
            depthCanvas.height = depthImg.height;
            depthCtx.drawImage(depthImg,0,0);
            const depthImageData = depthCtx.getImageData(0,0,depthImg.width,depthImg.height);
            setDepthData(depthImageData.data);
            setDepthSize({width:depthImg.width,height:depthImg.height});
        }

        loadImages();

    },[stadiumSrc,depthSrc])

    return(
        <div>
            <Canvas style={{ height: '50vh', width: '50vw',border: '2px solid #111111' }} camera={{ position: [0, -1, -1],fov:30}}>
                {stadiumData && depthData && (
                        <CloudImage 
                            pixelData={stadiumData}
                            depthData={depthData}  
                            width={imgSize.width} 
                            height={imgSize.height}
                            depthWidth={depthSize.width}
                            depthHeight={depthSize.height}
                        />
                    )}
                <color attach="background" args={['#222222']}/>
                <OrbitControls maxPolarAngle={Math.PI/2+0.25} minPolarAngle={Math.PI/2} enablePan={false} enableZoom={false}/>
            </Canvas>
            <canvas ref={canvasRef} hidden />
            <canvas ref={depthCanvasRef} hidden />
        </div>
    )

}


function CloudImage({pixelData,depthData,width,height,depthWidth,depthHeight}){
    const pointsRef = useRef();

    const { positions,colors } = useMemo(() => {
        const positions = new Float32Array(width*height*3);
        const colors = new Float32Array(width*height*3);
        
        const aspect = width / height;
        const xScale = aspect > 1 ? 1 : aspect;
        const yScale = aspect < 1 ? 1 : 1/aspect;
        const zScale = 2;

        for(let y = 0; y < height; y++){
            for(let x = 0; x < width; x++){
                const idx = y * width + x;
                const i3 = idx * 3;

                const depthX = Math.floor((x / width) * depthWidth);
                const depthY = Math.floor((y / height) * depthHeight);
                const depthIdx = (depthY * depthWidth + depthX) * 4;

                const zDepth = (1 - depthData[depthIdx] / 255) * zScale;

                positions[i3] = (0.5 - x / width) * xScale;
                positions[i3+1] = (0.5 - y / height) * yScale;
                positions[i3+2] = zDepth;;

                const colorIdx = idx*4;

                const r = Math.pow(pixelData[colorIdx] / 255, 2.2);
                const g = Math.pow(pixelData[colorIdx+1] / 255, 2.2);
                const b = Math.pow(pixelData[colorIdx+2] / 255, 2.2);

                colors[i3] = r;
                colors[i3+1] = g;
                colors[i3+2] = b;
            }
        }

        return { positions, colors }
    },[pixelData,depthData,width,height,depthWidth,depthHeight])

    return(
        <Points ref={pointsRef} positions={positions} colors={colors}>
            <pointsMaterial
                vertexColors
                size={1}
                sizeAttenuation={false}
                transparent
                opacity={0.8}
            />
        </Points>
    )
}