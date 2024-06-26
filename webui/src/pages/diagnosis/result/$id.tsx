import { useParams } from "ice";
import { Card, Message } from "@alifd/next";
import DiagnosisGraph from "./components/DiagnosisGraph";
import PageHeader from "@/components/PageHeader";
import ResultDialog from "./components/ResultDialog";
import { useEffect, useState } from "react";
import { ResultDialogData } from "./components/ResultDialog";
import diagnosisService from "@/services/diagnosis";

export default function Result() {
    const params = useParams()
    const [visible, setVisible] = useState(false)
    const [dialogData, setDialogData] = useState<ResultDialogData>()
    const [data, setData] = useState<DiagnosisResultData>();
    useEffect(() => {
        diagnosisService.getDiagnosisById(params.id)
        .then(res => {
            setData(JSON.parse(res.result))
        })
        .catch(err => {
            Message.error(`Error when getting diagnosis result: ${err.message}`)
        })
    }, [])

    const showResultDialog = (type, id) => {
        let newDialogData: DiagnosisNode | DiagnosisLink | undefined;
        switch(type) {
            case "node":
                newDialogData = data?.nodes?.find(item => item.id === id)
                break;
            case "edge":
                newDialogData = data?.links?.find(item => item.id === id)
                break;
        }

        if (newDialogData) {
            setDialogData({
                "type": type,
                "data": newDialogData
            })
            setVisible(true)
        }
    };

    return (
        <div>
            <PageHeader
                title="Diagnosis Result"
                breadcrumbs={[{ name: 'Console' }, { name: 'Diagnosis' }, { name: 'Connectivity Diagnosis',  path: '#/diagnosis'}, { name: 'Diagnosis Result' }]}
            />
            <Card title="Network Link Graph" contentHeight="auto">
                <Card.Content>
                    <DiagnosisGraph data={data} onClick={showResultDialog}/>
                </Card.Content>
            </Card>
        <ResultDialog data={dialogData} visible={visible} onClose={() => setVisible(false)}/>
        </div>
    )
}
