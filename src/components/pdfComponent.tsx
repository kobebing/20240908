import { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { Document, Page, pdfjs } from 'react-pdf';
import { AiOutlineRedo } from "react-icons/ai";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Fragment } from 'react/jsx-dev-runtime';
import styles from '@/styles/index.module.scss'
// 设置 PDF.js worker 的路径
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

const PdfComponent = forwardRef(({ files }: any, ref) => {
    const [numPages, setNumPages] = useState<number>(1);
    const [rotations, setRotations] = useState<any>({});
    const [width, setWidth] = useState(170);

    function onDocumentLoadSuccess({ numPages }: any) {
        setNumPages(numPages);
    }
    function handlePageClick(number: any) {
        setRotations({
            ...rotations,
            [number]: ((rotations[number] || 0) + 90) % 360
        })

    };
    function rotateAll() {
        console.log('test', numPages);
        let obj: any = rotations
        for (let i = 0; i < numPages + 1; i++) {
            obj[i] = ((obj[i] || 0) + 90) % 360
        }
        setRotations({
            ...obj
        })
    }
    function zoomInOut(status: string) {
        if (status == 'in') {
            if (width < 490) {
                setWidth(width + 40)
            }
        } else {
            if (width > 90) {
                setWidth(width - 40)
            }

        }
    }
    // 清除状态
    function clear() {
        setRotations({})
        setWidth(170)
    }

    useImperativeHandle(ref, () => ({
        rotateAll,
        zoomInOut,
        clear
    }))

    return (
        <Fragment>
            {
                files !== null ? (
                    <Document file={files} onLoadSuccess={onDocumentLoadSuccess}>
                        <div className={styles.page}>
                            {Array.from(
                                new Array(numPages),
                                (el, index) => {
                                    const rotation = rotations[index + 1] || 0;
                                    const rotateStyle = {
                                        transform: `rotate(${rotation}deg)`,
                                    };
                                    return <div key={`page_${index + 1}`} className={styles.pageChil} onClick={() => handlePageClick(index + 1)}>
                                        <div style={rotateStyle}>
                                            <Page
                                                pageNumber={index + 1}
                                                width={width}
                                            />
                                        </div>
                                        <p>{index + 1}</p>
                                        <div className={styles.aiIcon}>
                                            <AiOutlineRedo />
                                        </div>
                                    </div>
                                }
                            )}
                        </div>
                    </Document>
                ) : null
            }
        </Fragment>

    )
})

export default PdfComponent;