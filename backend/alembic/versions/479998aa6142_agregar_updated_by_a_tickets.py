"""agregar_updated_by_a_tickets

Revision ID: 479998aa6142
Revises: 0e9329aceeac
Create Date: 2026-10-03 10:41:02.894062

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '479998aa6142'
down_revision: Union[str, Sequence[str], None] = '0e9329aceeac'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('tickets', sa.Column('updated_by', sa.String(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('tickets', 'updated_by')
