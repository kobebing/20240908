'use client'
import { useRef, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { ZoomInOutlined, ZoomOutOutlined, CloudUploadOutlined, TikTokOutlined, YoutubeOutlined, TwitterOutlined, CameraOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Tooltip, Button, Upload } from 'antd';
import styles from '@/styles/index.module.scss'
import PdfComponent from '@/components/pdfComponent'

const { Dragger } = Upload;

export default function Home() {
    const [files, setFiles] = useState<any>(null);
    const [draggerKey, setDraggerKey] = useState(Date.now());
    const btnText = {
        removeBtn: 'Remove this PDF and select a new one',
        zoomin: 'Zoom in',
        zoomout: 'Zoom out',
        download: 'Split and download PDF',
    }
    const pdfRef = useRef<any>(null)
    const uploadStyles = {
        width: '275px',
        backgroundColor: '#fff',
        display: files ? 'none' : 'block'
    }
    const props: UploadProps = {
        name: 'file',
        multiple: true,
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(status);
                const files = info.fileList.map(file => file.originFileObj)
                setFiles(files[files.length - 1])
            }
            if (status === 'done') {
                // message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') { }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };
    function rotateAllChange() {
        if (pdfRef.current) pdfRef.current.rotateAll()
    }
    function removeChange() {
        setFiles(null)
        if (pdfRef.current) {
            pdfRef.current.clear()
            setDraggerKey(Date.now());
        }

    }
    function zoomChange(status: string) {
        if (pdfRef.current) pdfRef.current.zoomInOut(status)
    }
    function downloadChange() {
        const url = URL.createObjectURL(files);
        const a = document.createElement('a');
        a.href = url;
        a.download = files.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    return (
        <>
            <Head>
                <title>Free PDF Page Rotator - Rotate Individual or All Pages</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                {/* 顶部 */}
                <div className={styles.description}>
                    <a href="#">
                        <svg viewBox="0 0 64 36" width={30} height={30} xmlns="http://www.w3.org/2000/svg"><path fill="black" d="M41.3111 0H37.6444C30.3111 0 24.6889 4.15556 21.7556 9.28889C18.8222 3.91111 12.9556 0 5.86667 0H2.2C0.977781 0 0 0.977779 0 2.2V5.86667C0 16.1333 8.31111 24.2 18.3333 24.2H19.8V33C19.8 34.2222 20.7778 35.2 22 35.2C23.2222 35.2 24.2 34.2222 24.2 33V24.2H25.6667C35.6889 24.2 44 16.1333 44 5.86667V2.2C43.5111 0.977779 42.5333 0 41.3111 0ZM19.3111 19.5556H17.8444C10.2667 19.5556 4.15556 13.4444 4.15556 5.86667V4.4H5.62222C13.2 4.4 19.3111 10.5111 19.3111 18.0889V19.5556ZM39.1111 5.86667C39.1111 13.4444 33 19.5556 25.4222 19.5556H23.9556V18.0889C23.9556 10.5111 30.0667 4.4 37.6444 4.4H39.1111V5.86667Z"></path></svg>
                        <span className={styles.logo}>PDF.ai</span>
                    </a>
                    <div>
                        <Link href='/'>Pricing</Link>
                        <Link href='/'>Chrome extension</Link>
                        <Link href='/'>Use cases</Link>
                        <Link href='/'>Get started →</Link>
                    </div>
                </div>
                {/*content*/}
                <div className={styles.center}>
                    <h1 className={styles.h1Tip}>Rotate PDF Pages</h1>
                    <p className={styles.tip}>Simply click on a page to rotate it. You can then download your modified PDF.</p>
                    {/* 上传 */}
                    <div className={styles.upload} style={{ display: files ? 'none' : 'flex' }}>
                        <Dragger {...props} key={draggerKey} accept="application/pdf" style={uploadStyles}>
                            <p className={styles.draggerIcon}>
                                <CloudUploadOutlined />
                            </p>
                            <p className="ant-upload-text" style={{ marginBottom: '120px' }}>Click to upload or drag and drop</p>
                        </Dragger>
                    </div>
                    {/* 旋转、删除、查看 */}
                    <div style={{ display: files ? 'block' : 'none' }}>
                        <div className={styles.updateBtn}>
                            <button className={styles.rotate} onClick={rotateAllChange}>Rotate all</button>
                            <Tooltip placement="top" title={btnText.removeBtn}>
                                <button className={styles.remove} onClick={removeChange}>Remove PDF</button>
                            </Tooltip>
                            <Tooltip title={btnText.zoomin}>
                                <Button shape="circle" icon={<ZoomInOutlined />} onClick={() => zoomChange('in')} />
                            </Tooltip>
                            <Tooltip title={btnText.zoomout}>
                                <Button shape="circle" icon={<ZoomOutOutlined />} onClick={() => zoomChange('out')} />
                            </Tooltip>
                        </div>
                        {/* pdf旋转组件 */}
                        <PdfComponent files={files} ref={pdfRef} />
                        <Tooltip placement="top" title={btnText.download}>
                            <button className={styles.download} onClick={downloadChange}>Download</button>
                        </Tooltip>
                    </div>
                </div>
                {/*footer*/}
                <div className={styles.grid}>
                    <div className={styles.footer}>
                        <div className={styles.left}>
                            <Image src='/favicon.ico' width={27} height={27} alt='favicon.ico'/>
                            <p>Chat with any PDF: ask questions, get summaries, find information, and more.</p>
                            <div className={styles.iconList}>
                                <span>
                                    <TikTokOutlined />
                                </span>
                                <span>
                                    <YoutubeOutlined />
                                </span>
                                <span>
                                    <TwitterOutlined />
                                </span>
                                <span>
                                    <CameraOutlined />
                                </span>
                            </div>
                        </div>
                        <div className={styles.right}>
                            <div className={styles.product}>
                                <h3>Products</h3>
                                <div>
                                    <p>Use cases</p>
                                    <p>Chrome extension</p>
                                    <p>API docs</p>
                                    <p>Video tutorials</p>
                                    <p>Resources</p>
                                    <p>Video tutorials</p>
                                    <p>Blog</p>
                                    <p>FAQ</p>
                                </div>
                            </div>
                            <div className={styles.product}>
                                <h3>We also built</h3>
                                <div>
                                    <p>Resume AI Scanner</p>
                                    <p>Invoice AI Scanner</p>
                                    <p>API docs</p>
                                    <p>Video tutorials</p>
                                    <p>Resources</p>
                                    <p>Video tutorials</p>
                                    <p>Blog</p>
                                    <p>FAQ</p>
                                </div>
                            </div>
                            <div className={styles.product}>
                                <h3>Company</h3>
                                <div>
                                    <p>PDF.ai vs ChatPDF</p>
                                    <p>PDF.ai vs Acrobat Reader</p>
                                    <p>API docs</p>
                                    <p>Video tutorials</p>
                                    <p>Resources</p>
                                    <p>Video tutorials</p>
                                    <p>Blog</p>
                                    <p>FAQ</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
