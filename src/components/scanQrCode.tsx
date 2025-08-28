"use client"
import { useQRCode } from 'next-qrcode';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import { QrCode } from 'lucide-react'
import { Button } from "./ui/button";
import { SESSION_DATA } from '@/types/types';
import { truncateMiddle } from '@/lib/utils';


type Props = {
    data : SESSION_DATA
    amount : number
}
export default function ScanQrCode({data, amount} : Props) {
  const { Canvas } = useQRCode();
 const isTrue = true

  return (
    <div>
  {/* QR Code Accordion */}
            <Accordion type="single" collapsible className="border rounded-lg">
              <AccordionItem value="qr-code" className="border-none">
                <AccordionTrigger 
                  className="px-4 py-3 hover:no-underline"
                  data-testid="button-scan-qr"
                >
                  <div className="flex items-center">
                    <QrCode className="w-5 h-5 mr-3" />
                    Scan QR code
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-4">
                

                    {/* QR Code */}
              <div className='w-full flex items-center justify-center'>
              <div className='p-2 border  rounded-xl'>
                 <Canvas
      text={'https://github.com/bunlong/next-qrcode'}
      options={{
        errorCorrectionLevel: 'M',
        margin: 0,
        scale: 4,
        width: 200,
        color: {
          dark: '#080807',
          light: '#ffffff',
        },
      }}
      
    />
    </div>
              </div>

                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900 mb-2">
                        {amount.toFixed(2)} {"sBTC"}
                      </div>
                      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded font-mono break-all mb-4">
                        {truncateMiddle(data.session.id, 12, 8)}
                      </div>
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-800 mb-4">
                        Pay only <span className="font-semibold">{"sBTC"}</span> on <span className="font-semibold">Stack Network</span>.
                      </div>
                    </div>

                    <div className="flex items-start space-x-2 text-xs text-gray-500">
                      <div className="w-4 h-4 mt-0.5">⚠️</div>
                      <p>Sending funds on the wrong network or token leads to fund loss.</p>
                    </div>

                    <Button 
                      onClick={() => console.log("Hello world")}
                      disabled={true}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      data-testid="button-checking-payment"
                    >
                      {isTrue ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Checking payment status...
                        </>
                      ) : (
                        "Checking payment status..."
                      )}
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
  )
}
