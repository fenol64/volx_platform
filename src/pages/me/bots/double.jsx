import Spinner from '@/root/src/components/Pageloading';
import api from '@/root/src/libs/api';
import { verifyUser } from '@/root/src/libs/verify_user';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

// import { Container } from './styles';

function bots() {
    const router = useRouter();
    const [loading, toggleLoading] = useState(true);
    const [btn_loading, toggleBtnLoading] = useState(false);
    const [blaze_data, setBlazeData] = useState({});
    const [user, setUser] = useState({});

    const getBlazeConfig = async (userdata) => {
        try {
            toggleLoading(true);
            const response = await api.get('/bots/double?user_uuid=' + userdata.uuid);
            console.log(response)
            setBlazeData(response.data.data[0] ?? {});
            toggleLoading(false);
        } catch (error) {
            toggleLoading(false);
        }
    };

    const handleInput = (e) => setBlazeData({ ...blaze_data, [e.target.name]: e.target.value })

    const handleSubmit = (e) => {
        e.preventDefault()
        toggleBtnLoading(true)
        console.log(blaze_data)
        delete blaze_data.created_at
        api.post(`/bots/double?user_uuid=${user.uuid}`, blaze_data).then(async res => {
            console.log(res)

        }).catch(err => {
            console.log(err)
        }
        ).finally(() => {
            toggleBtnLoading(false)
        })
    }

    useEffect(() => {
        console.log('me');
        verifyUser().then(user => {
            console.log(user)
            setUser(user[0])
            getBlazeConfig(user[0])
        })

    }, []);


    return loading ? <Spinner className="text-primary" /> : <main>
        <div className="container">
            <div className="d-flex flex-row align-items-center gap-3 my-3">
                <button className="btn btn-sm btn-secondary" onClick={() => router.back()}>voltar</button>
                <h1>Double Bot!</h1>
            </div>
            <hr />
            <form onSubmit={handleSubmit}>
                <div className="row g-3">
                    <div className="col-12 col-md-6">
                        login da blaze
                        <input type="text" name="blaze_login" value={blaze_data.blaze_login ?? ""} onChange={handleInput} className="form-control" placeholder="login da blaze" />
                    </div>
                    <div className="col-12 col-md-6">
                        Senha da blaze
                        <input type="password" name="blaze_password" value={blaze_data.blaze_password ?? ""} onChange={handleInput} className="form-control" placeholder="senha da blaze" />
                    </div>
                    <div className="col-12 d-flex gap-3">
                        <div>
                            <input type="checkbox" name="margingale_enabled" defaultChecked={blaze_data.margingale_enabled ?? false} value={blaze_data.margingale_enabled ?? "1"} onChange={handleInput} /> <span>margingale</span>
                        </div>
                        <div>
                            <input type="checkbox" name="white_protection" defaultChecked={blaze_data.white_protection ?? false} value={blaze_data.white_protection ?? "1"} onChange={handleInput} />  <span>Protegido no branco</span>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        Valor de aposta
                        <input type="number" name="value_bet" className="form-control" placeholder="Valor de aposta" value={blaze_data.value_bet ?? ""} onChange={handleInput} />
                    </div>
                    <div className="col-6 col-md-3">
                        stop gain
                        <input type="number" name="stop_gain" className="form-control" placeholder="stop gain" value={blaze_data.stop_gain ?? ""} onChange={handleInput} />
                    </div>
                    <div className="col-6 col-md-3">
                        stop loss
                        <input type="number" name="stop_loss" className="form-control" placeholder="stop loss" value={blaze_data.stop_loss ?? ""} onChange={handleInput} />
                    </div>
                    <div className="col-6 col-md-3">
                        martingale
                        <input type="number" name="martingale_tries" className="form-control" placeholder="margingales" value={blaze_data.martingale_tries ?? ""} onChange={handleInput} />
                    </div>
                </div>
                <div className="col my-3 d-flex flex-row justify-content-end">
                    <button className="btn btn-success">Salvar {btn_loading && <Spinner className="text-white fa-sm" />}</button>
                </div>
            </form>
        </div>
    </main>;
}

export default bots;