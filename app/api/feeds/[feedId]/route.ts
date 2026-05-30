export async function GET(request: any) {
  return {
    status: 200,
    body: JSON.stringify([{ id: '1', title: 'Test' }])
  };
}

export async function POST(request: any) {
  return {
    status: 201,
    body: JSON.stringify({ message: 'Created' })
  };
}

export async function DELETE(request: any) {
  return {
    status: 204,
    body: ''
  };
}
