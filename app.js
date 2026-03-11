import 'dotenv/config';
import express from 'express';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = process.env.PORT || 3000;


// configuração do supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.use(express.json());//para interpretar o corpo das requisições como json
app.use(express.static('public'));

//variavel para as rotas de agendmanto
const rotasAgendamento = ['/salvar-agendamento', '/salvar/agendamento'];

app.post(rotasAgendamento, async (req, res) => {
  const { nome, telefone, dia, hora } = req.body;

  if (!nome || !telefone || !dia || !hora) {
    return res.status(400).send({
      message: 'Preencha nome, telefone, dia e hora.'
    });
  }

  try {
    const { data, error } = await supabase
      .from('agendamentos')
      .insert([
        { nome, telefone, dia, hora }
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar no Supabase:', error);
      return res.status(500).send({
        message: 'Erro interno ao salvar agendamento'
      });
    }

    const mensagem = `Olá ${nome}, seu agendamento para o dia ${dia} às ${hora} foi salvo com sucesso!`;

    res.status(200).send({
      message: mensagem,
      agendamento: data
    });
  } catch (err) {
    console.error('Erro ao processar agendamento:', err);
    res.status(500).send({
      message: 'Erro interno ao salvar agendamento'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


//rota dos agendamentos
app.get('/agendamentos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('agendamentos')
      .select('*')
      .order('dia', { ascending: true })
      .order('hora', { ascending: true });

    if (error) {
      console.error('Erro ao buscar agendamentos:', error);
      return res.status(500).send({
        message: 'Erro ao buscar agendamentos'
      });
    }

    res.status(200).send(data);
  } catch (err) {
    console.error('Erro ao listar agendamentos:', err);
    res.status(500).send({
      message: 'Erro ao buscar agendamentos'
    });
  }
});