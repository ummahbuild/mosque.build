import{DesignStudioDashboard}from"@/components/design-studio-dashboard";import{SiteFooter}from"@/components/site-footer";import{SiteHeader}from"@/components/site-header";
export const metadata={title:"Architecture and design studio",description:"Organize mosque project concepts and enter mosque.build design tools directly.",robots:{index:false,follow:false}};
export default function Page(){return <><SiteHeader/><main id="main-content"><DesignStudioDashboard/></main><SiteFooter/></>}
