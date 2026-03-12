 "use client";
                                                            
  import { CldImage } from "next-cloudinary";               
                                                            
  export default function Illustration() {                  
    return (                         
      <main className="px-8 py-12">                         
        <h1 className="text-2xl font-bold                   
  mb-8">Illustration</h1>                                   
        <div className="grid grid-cols-2 gap-4">            
          <CldImage                                         
                                                            
  src="91bfe02ace532bee28130dd052a8541e-1536x1536_orunko"   
            width={800}                                     
            height={800}                                    
            alt="illustration"                              
          />                                                
          <CldImage                                         
            src="IMG_2648_cwvskj"                           
            width={800}                                     
            height={800}                                    
            alt="illustration"                              
          />                                                
          <CldImage                  
            src="IMG_2485_ubtrei"                           
            width={800}                                     
            height={800}                                    
            alt="illustration"                              
          />                                                
        </div>                                              
      </main>                                               
    );                                                      
  }  