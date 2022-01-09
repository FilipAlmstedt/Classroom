import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

interface ICodeInput {
    htmlCode?: string;
    cssCode?: string;
}

export const ShowPostedCode = (props: ICodeInput) => {
    // console.log(props.cssCode);
    
    return (

        <>
            <style>{props.cssCode}</style>

            <div className="code-result-wrapper">
                <div className="code-container">
                    <ReactMarkdown rehypePlugins={[rehypeRaw]} children={props?.htmlCode || ""} />
                </div>
            </div>
        </>



    );
}