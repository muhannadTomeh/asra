import React from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import { api } from '../../../utils/api'
import { Box, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'

const SeasonsListPage: React.FC = () => {
  const { companyId } = useParams()
  const [data, setData] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/companies/${companyId}/seasons`)
        setData(res.data)
      } catch (e: any) { setError(e.message) } finally { setLoading(false) }
    })()
  }, [companyId])

  if (loading) return <Box textAlign="center"><CircularProgress /></Box>
  if (error) return <Typography color="error">{error}</Typography>

  return (
    <Paper>
      <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">مواسم الشركة</Typography>
        <Button variant="contained" component={RouterLink} to={`/companies/${companyId}/seasons/new`}>موسم جديد</Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>المعرف</TableCell>
            <TableCell>نسبة الريد</TableCell>
            <TableCell>نشط</TableCell>
            <TableCell>إجراءات</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(s => (
            <TableRow key={s.seasonId} hover>
              <TableCell>{s.seasonId}</TableCell>
              <TableCell>{s.ridPercentage}</TableCell>
              <TableCell>{s.isActiveSeason ? 'نعم' : 'لا'}</TableCell>
              <TableCell>
                <Button size="small" component={RouterLink} to={`/seasons/${s.seasonId}`}>تفاصيل</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

export default SeasonsListPage