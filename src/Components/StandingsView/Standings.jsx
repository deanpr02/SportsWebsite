import { useState,useEffect,useMemo,useRef } from 'react'
import { Canvas,useThree,useLoader } from '@react-three/fiber'
import { Edges,OrbitControls,Instance,Instances } from '@react-three/drei'
import { TextureLoader } from 'three';
import * as THREE from 'three'

import { useRetrieveTeam } from '../../Hooks/useRetrieveTeam'
import StandingsChart from './StandingsChart';
import './Standings.css'

const standings = {
    'American League':
        {
            'East':
                {
                    "New York Yankees":{'W':94,"L":68},
                    "Boston Red Sox":{'W':81,"L":81},
                    "Baltimore Orioles":{'W':91,"L":71},
                    "Toronto Blue Jays":{'W':74,"L":88},
                    "Tampa Bay Rays":{'W':80,"L":82}
                },
            "Central":
                {
                    "Cleveland Guardians":{'W':92,"L":69},
                    "Minnesota Twins":{'W':82,"L":80},
                    "Detroit Tigers":{'W':86,"L":76},
                    "Kansas City Royals":{'W':86,"L":76},
                    "Chicago White Sox":{'W':41,"L":121}
                },
            "West":
                {
                    "Houston Astros":{'W':88,"L":73},
                    "Seattle Mariners":{'W':85,"L":77},
                    "Los Angeles Angels":{'W':63,"L":99},
                    "Texas Rangers":{'W':78,"L":84},
                    "Oakland Athletics":{'W':69,"L":93}
                }
        },
    "National League":
        {
            "East":
                {
                    "Philadelphia Phillies":{'W':95,"L":67},
                    "New York Mets":{'W':89,"L":73},
                    "Atlanta Braves":{'W':89,"L":73},
                    "Washington Nationals":{'W':71,"L":91},
                    "Miami Marlins":{'W':62,"L":100}
                },
            "Central":
                {
                    "St. Louis Cardinals":{'W':83,"L":79},
                    "Chicago Cubs":{'W':83,"L":79},
                    "Pittsburgh Pirates":{'W':76,"L":86},
                    "Cincinnati Reds":{'W':77,"L":85},
                    "Milwaukee Brewers":{'W':93,"L":69}
                },
            "West":
                {
                    "Los Angeles Dodgers":{'W':98,"L":64},
                    "Arizona Diamondbacks":{'W':89,"L":73},
                    "San Francisco Giants":{'W':80,"L":82},
                    "San Diego Padres":{'W':93,"L":69},
                    "Colorado Rockies":{'W':61,"L":101}
                }
        }
}


export default function Standings(){
    const [conference,setConference] = useState('American League')
    const [division,setDivision] = useState('East')
    const [teams,setTeams] = useState(undefined)
    let rot = 0;
    //const division = standings["American League"]["East"]

    useEffect(() => {
        const selectedTeams = {}
        if(conference === 'MLB'){
            Object.values(standings).forEach(league => {
                Object.values(league).forEach(divisionTeams => {
                    Object.assign(selectedTeams, divisionTeams)
                    })
                })
            }
        else{
            const conf = standings[conference]
            if(conf){
                Object.assign(selectedTeams,conf[division])
            }
        }
            setTeams(selectedTeams)
    },[conference,division])

    return(
        <div className='standings-container'>
        <div className='standings-visual-container'>
            <Canvas style={{ height: '50vh', width: '50vw',border: '2px solid #111111',borderRadius:'10px' }} camera={{ position: [5, 8, 5]}}>
                {standings && (() => {

                    const totalDivisions = Object.values(standings).reduce((acc, conf) => acc + Object.keys(conf).length, 0);
                    const radius = 50;
                    let divisionIndex = 0;
                
                    return Object.entries(standings).flatMap(([confName, divisions]) => {
                        return Object.entries(divisions).map(([divName, teams]) => {
                            const angle = (divisionIndex * 2 * Math.PI) / totalDivisions;
                            const x = radius * Math.sin(angle);
                            const z = radius * Math.cos(angle);
                            divisionIndex++;
                        
                        return (
                            <group 
                                key={`${confName}-${divName}`} 
                                position={[x, 0, z]} 
                                rotation={[0, angle + Math.PI/2, 0]}>
                                {Object.entries(teams).map(([name, obj], i) => {
                                    const teamOffset = i - (Object.keys(teams).length - 1) / 2;
                                    return <IndividualStanding 
                                        key={name} 
                                        pos={[teamOffset * 11, 0, 0]} // Center teams within division
                                        teamName={name} 
                                        wins={obj.W} 
                                        losses={obj.L} />
                                })}
                            </group>
                            )
                        })
                    })
                })()}
                <mesh position={[0,0,0]} rotation={[Math.PI/2,0,0]}>
                    <planeGeometry args={[200,200]}/>
                    <meshStandardMaterial color="black" transparent={true} opacity={0.3} side={2}/>
                </mesh>
                <ambientLight intensity={3} />
                <color attach="background" args={['#444444']}/>
                <CustomCamera/>
                <OrbitControls/>
            </Canvas>
        </div>
        <StandingsChart standings={standings}/>
        </div>
    )
}

function IndividualStanding({pos,teamName,wins,losses,rotation}){
    const teamInfo = useRetrieveTeam(teamName);
    const gamesAbove500 = wins - losses;
// Base height plus bonus for games above .500
    const height =  (gamesAbove500);
// Add a minimum height
    const finalHeight = height;
    return(
        <group>
            { teamInfo &&
            <>
                <VoxelImage logoSrc={teamInfo.primaryLogo} pos={pos} logoHeight={finalHeight}/>
                <Pillar pos={pos} teamColor={teamInfo.primaryColor} wins={wins} losses={losses} height={finalHeight} rotation={rotation}/>
            </>
            }
            </group>
    )
}

function CustomCamera() {
    const { camera } = useThree();

    // Point the camera towards (0, 0, 0)
    camera.lookAt(0, 0, 0);

    return null; // This component doesn't render anything
}

function Pillar({pos,teamColor,wins,losses,height,rotation}){
    return(
        <group position={pos}>
            <mesh position={[0,height/2,0]} rotation={rotation}>
                <boxGeometry args={[10, height, 10]} />
                <meshStandardMaterial color={`#${teamColor}`}/>
                <Edges color='white'/>
            </mesh>
            
        </group>
    )
}

//function DepthifiedLogo({ srcLogo }) {
//    const canvasRef = useRef(null);
//    const [logoSize, setLogoSize] = useState({ width: 0, height: 0 });
//    const [logoData, setLogoData] = useState(null);
//
//    useEffect(() => {
//        const canvas = canvasRef.current;
//        const ctx = canvas.getContext('2d');
//
//        const loadImage = async () => {
//            const img = new Image();
//            img.src = srcLogo;
//            await img.decode();
//
//            const scaleFactor = 0.25;
//
//            canvas.width = img.width * scaleFactor;
//            canvas.height = img.height * scaleFactor;
//
//            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//            setLogoData(imageData.data);
//            setLogoSize({ width: canvas.width, height: canvas.height });
//        };
//
//        loadImage();
//    }, [srcLogo]);
//
//    return (
//        <>
//            <canvas ref={canvasRef} hidden />
//            <Canvas style={{ height: '50vh', width: '50vw', border: '2px solid #111111' }} camera={{ position: [0, 0, 2], fov: 50 }}>
//                <ambientLight intensity={0.5} />
//                <pointLight position={[10, 10, 10]} intensity={1} />
//                {logoData && (
//                    <VoxelImage
//                        pixelData={logoData}
//                        width={logoSize.width}
//                        height={logoSize.height}
//                    />
//                )}
//                <OrbitControls />
//            </Canvas>
//        </>
//    );
//}

function VoxelImage({ logoSrc,pos,logoHeight}) {
    const texture = useLoader(TextureLoader,logoSrc);
    const meshRef = useRef();
    const [pixelData,setPixelData] = useState(null);
    const [dimensions,setDimensions] = useState({width:0,height:0});
    
    useEffect(() => {
        if (!texture) return;

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d');

        //const scaleFactor = 0.25;
        //const width = texture.image.width * scaleFactor;
        //const height = texture.image.height * scaleFactor;

        const targetWidth = 100; 
        
        // Calculate adaptive scale factor based on original image width
        const scaleFactor = targetWidth / texture.image.width;
        
        // Apply the scale factor to get dimensions
        const width = Math.floor(texture.image.width * scaleFactor);
        const height = Math.floor(texture.image.height * scaleFactor);

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(texture.image,0,0,width,height);

        const imageData = ctx.getImageData(0,0,width,height);
        setPixelData(imageData.data);
        setDimensions({width:canvas.width,height:canvas.height});

        canvas.remove();
    },[texture])

    useEffect(() => {
        if (!meshRef.current || !pixelData) return;
    
      // Create temporary object to help position instances
        const tempObject = new THREE.Object3D();
        const tempColor = new THREE.Color();
    
        //const {width,height} = dimensions;
        
        let instanceCount = 0;
      // First count non-transparent pixels to know how many instances we need
        for (let i = 0; i < dimensions.width * dimensions.height; i++) {
            const idx = i * 4;
            const alpha = pixelData[idx + 3];
            if (alpha > 10) instanceCount++;
        }
    
      // Set the count on the instanced mesh
        meshRef.current.count = instanceCount;
    
      // Now set the matrix and color for each instance
        let instanceIndex = 0;
        for (let i = 0; i < dimensions.width * dimensions.height; i++) {
            const x = i % dimensions.width;
            const y = Math.floor(i / dimensions.width);
            const idx = i * 4;
            const alpha = pixelData[idx + 3];
        
        // Skip transparent pixels
            if (alpha <= 10) continue;
        
            const scale = 0.1;
        // Position the temporary object
            tempObject.position.set(
                (x - dimensions.width/2)*scale,  // Center horizontally
                (-y + dimensions.height/2)*scale, // Center vertically and flip Y axis
                0
            );
        
        // Update its matrix
            tempObject.updateMatrix();
        
        // Set the matrix for this instance
            meshRef.current.setMatrixAt(instanceIndex, tempObject.matrix);
        
        // Set the color for this instance
            tempColor.setRGB(
                Math.pow(pixelData[idx] / 255,2.1),
                Math.pow(pixelData[idx + 1] / 255,2.1),
                Math.pow(pixelData[idx + 2] / 255,2.1)
        );

        meshRef.current.setColorAt(instanceIndex, tempColor);
        
        instanceIndex++;
    }
    
      // Update the instance matrices and colors
        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    
        }, [pixelData, dimensions.width, dimensions.height]);
    
    return (
        <group position={pos}>
        <instancedMesh 
            ref={meshRef} 
            args={[null, null, dimensions.width * dimensions.height]} 
            position={[0,logoHeight >= 0 ? logoHeight+10 : logoHeight-10,0]}// Maximum possible instances
        >
        <boxGeometry args={[0.1, 0.1, 2.5]} />
        <meshStandardMaterial />
        </instancedMesh>
        </group>
    );
    }
