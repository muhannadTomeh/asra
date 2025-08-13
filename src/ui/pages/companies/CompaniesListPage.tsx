import React from 'react'
import { api } from '../../../utils/api'
import { Box, CircularProgress, IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography, Button, Stack } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import InfoIcon from '@mui/icons-material/Info'

const CompaniesListPage: React.FC = () => {
  const [data, setData] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/companies')
        setData(res.data)
      } catch (e: any) { setError(e.message) } finally { setLoading(false) }
    })()
  }, [])

  if (loading) return <Box textAlign="center"><CircularProgress /></Box>
  if (error) return <Typography color="error">{error}</Typography>

  return (
    <Paper>
      <Stack direction="row" alignItems="center" justifyContent="space-between" p={2}>
        <Typography variant="h5">الشركات</Typography>
        <Button variant="contained" component={RouterLink} to="/companies/new">شركة جديدة</Button>
      </Stack>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>الاسم</TableCell>
            <TableCell>العنوان</TableCell>
            <TableCell>المالك</TableCell>
            <TableCell>الحالة</TableCell>
            <TableCell>إجراءات</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(c => (
            <TableRow key={c.id} hover>
              <TableCell>{c.name}</TableCell>
              <TableCell>{c.address}</TableCell>
              <TableCell>{c.ownerName}</TableCell>
              <TableCell>{c.isActive ? 'نشط' : 'غير نشط'}</TableCell>
              <TableCell>
                <IconButton component={RouterLink} to={`/companies/${c.id}`}><InfoIcon /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

export default CompaniesListPage