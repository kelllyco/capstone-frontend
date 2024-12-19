export interface ProjectPreviewArrayAPI {
    projects: ProjectPreviewAPI[];
    totalCount: number;
}

export interface AddProjectInputsAPI {
    sqft: number;
    projectType: string;
    complexity: number;
    zipcode: number;
    projectName: string;
    dateDue: string;
    projectDescription: string;
    clientName: string;
    clientEmail: string;
    startDate: string;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
}

export interface AddProjectResponseAPI {
    projectNo: string;
}

export interface ProjectDetailsAPI{
    projectDescription: string;
    clientName: string;
    clientEmail: string;
    startDate: string;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
    cost: number;
    permitsAndFees: number;                    
    excavationAndDirtwork: number;   
    foundation: number;                         
    framing: number;                               
    roofing: number;                               
    guttersAndDownspouts: number;                   
    windowsAndSliders: number;           
    siding: number;                                 
    masonry: number;                               
    exteriorDoors: number;                   
    garageDoors: number;                            
    plumbingRoughIn: number;                        
    electricalRoughIn: number;                     
    heatingAndHVAC: number;                 
    insulation: number;                             
    drywallTapeAndTexture: number;                  
    fireplaceAndStove: number;           
    paintExterior: number;                          
    paintInterior: number;                           
    interiorTrimAndDoors: number;             
    interiorFinish: number;                 
    cabinets: number;                             
    countertops: number;                            
    sewerAndSeptic: number;                 
    water: number | undefined;                                  
    flooringVinyl: number; 
    flooringHardwood: number;
    flooringCarpet: number;                            
    decking: number;                               
    concrete: number;                               
    plumbingFinish: number;                 
    electricalFinish: number;             
    electricalLightFixtures: number;                
    hardware: number;                             
    appliances: number;                             
    utilities: number;                              
    restroomFacility: number;                       
    rentalEquipment: number;                        
    cleanupAndDumpFees: number;         
    landscape: number;                           
    designWork: number;                             
    plansAndEngineering: number;       
    surveys: number;                                 
    contingency: number;                            
    profitAndOverhead: number;                      
    warrantyWork: number;                          
    supervision: number;                            
    preConstructionServices: number;                
    bidPrep: number;                                
    tile: number;                                     
    mirrorsAndShowerDoors: number;   
    railingInstalled: number;                      
    smallToolsAndConsumables: number;               
    bbqIsland: number;                           
    loanInterest: number; 
    riskInsurance: number;
    lotPropertyTaxes: number;
    useTax: number; 
    profit: number;
    overhead: number;                     
}

export interface ProjectPreviewAPI {
    projectNo: number;
    userId: number;
    projectName: string;
    cost: number;
    dateDue: string;
    projectType: string;
    complexity: number;
    status: string;
    sqft: number;
    zipcode: number;
    riskOfOverrun: number;
}


export type ProjectAPI = ProjectPreviewAPI & ProjectDetailsAPI;


export interface ProjectRiskHistoryAPI {
    "projectId": number;
    "postingsOverall": ActualGraphDataPtAPI[];
    "userAvgsOverall": ExpectedGraphDataPtAPI[];
    "recentNumbers": ProjectSpendingAPI;
    "combinedData": CategoriesRiskAPI;
}

export interface ActualGraphDataPtAPI {
    "spending_percentage": number;
    "percentage_complete": number;
}

export interface ExpectedGraphDataPtAPI {
    "avg_spending": number;
    "percentage_complete": number;
}

export interface ProjectSpendingAPI {
    [key: string]: number;
}

export interface CategoriesRiskAPI {
    [key: string]: {
        "projectavg": number;
        "useravg": number;
    }
}