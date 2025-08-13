import React from 'react'
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom'
import { api } from '../../../utils/api'
import { Box, Button, Card, CardContent, CircularProgress, Grid, Stack, Typography } from '@mui/material'

const SeasonDetailsPage: React.FC = () => {
  const { seasonId } = useParams()
  const [data, setData] = React.useState<any | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const navigate = useNavigate()

  React.useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/seasons/${seasonId}`)
        setData(res.data)
      } catch (e: any) { setError(e.message) } finally { setLoading(false) }
    })()
  }, [seasonId])

  const onDelete = async () => {
    if (!confirm('حذف الموسم؟')) return
    try {
      await api.delete(`/seasons/${seasonId}`)
      navigate(`/companies/${data.companyId}/seasons`)
    } catch (e: any) { setError(e.message) }
  }

  if (loading) return <Box textAlign="center"><CircularProgress /></Box>
  if (error) return <Typography color="error">{error}</Typography>
  if (!data) return null

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>تفاصيل الموسم</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}><Typography>نسبة الريد: {data.ridPercentage}</Typography></Grid>
          <Grid item xs={12} sm={6}><Typography>تكلفة خزان البلاستيك: {data.plasticTankCost}</Typography></Grid>
          <Grid item xs={12} sm={6}><Typography>وزن خزان البلاستيك: {data.plasticTankWeight}</Typography></Grid>
          <Grid item xs={12} sm={6}><Typography>تكلفة خزان الحديد: {data.steelTankCost}</Typography></Grid>
          <Grid item xs={12} sm={6}><Typography>وزن خزان الحديد: {data.steelTankWeight}</Typography></Grid>
          <Grid item xs={12} sm={6}><Typography>تكلفة الخدمة/كغم: {data.serviceCostPerKg}</Typography></Grid>
          <Grid item xs={12} sm={6}><Typography>سعر بيع الزيت: {data.oilSellingCost}</Typography></Grid>
          <Grid item xs={12} sm={6}><Typography>سعر شراء الزيت: {data.oilBuyingCost}</Typography></Grid>
          <Grid item xs={12} sm={6}><Typography>نشط: {data.isActiveSeason ? 'نعم' : 'لا'}</Typography></Grid>
        </Grid>
        <Stack direction="row" spacing={2} mt={2}>
          <Button variant="contained" component={RouterLink} to={`/seasons/${seasonId}/edit`}>تعديل</Button>
          <Button variant="outlined" color="error" onClick={onDelete}>حذف</Button>
          <Button variant="text" component={RouterLink} to={`/companies/${data.companyId}/seasons`}>رجوع للمواسم</Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default SeasonDetailsPage