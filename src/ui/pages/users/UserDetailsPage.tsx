import React from 'react'
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom'
import { api } from '../../../utils/api'
import { Box, Button, Card, CardContent, CircularProgress, Stack, Typography } from '@mui/material'

const UserDetailsPage: React.FC = () => {
  const { id } = useParams()
  const [data, setData] = React.useState<any | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const navigate = useNavigate()

  React.useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/users/${id}`)
        setData(res.data)
      } catch (e: any) {
        setError(e.message)
      } finally { setLoading(false) }
    })()
  }, [id])

  const onDelete = async () => {
    if (!confirm('هل أنت متأكد من حذف المستخدم؟')) return
    try {
      await api.delete(`/users/${id}`)
      navigate('/users')
    } catch (e: any) { setError(e.message) }
  }

  if (loading) return <Box textAlign="center"><CircularProgress /></Box>
  if (error) return <Typography color="error">{error}</Typography>
  if (!data) return null

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>تفاصيل المستخدم</Typography>
        <Stack spacing={1}>
          <Typography>الاسم: {data.userName}</Typography>
          <Typography>رقم الهاتف: {data.phoneNumber}</Typography>
          <Typography>الحالة: {data.isActive ? 'نشط' : 'غير نشط'}</Typography>
        </Stack>
        <Stack direction="row" spacing={2} mt={2}>
          <Button variant="contained" component={RouterLink} to={`/users/${id}/edit`}>تعديل</Button>
          <Button variant="outlined" color="error" onClick={onDelete}>حذف</Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default UserDetailsPage